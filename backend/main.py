from fastapi import FastAPI, Query
import pickle
import heapq
from math import radians, sin, cos, sqrt, atan2
from typing import List, Optional, Literal
from prohibited_items import find_prohibited
import json
app = FastAPI()

with open(r'C:\Users\Asus\Desktop\RouteSyncAI\RouteSyncAI\backend\graph_final_5_precalc.pkl', "rb") as G:
    roadsn = pickle.load(G)

#CO2 emission factors
EMISSION_FACTORS = {
    "sea": 0.01,  # 10g per ton-km
    "land": 0.1,  # 100g per ton-km
    "air": 0.7,   # 700g per ton-km
}


# Constants
time_min, time_max = 0, 740.8010060257351
price_min, price_max = 0, 49341.63950694249

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def precompute_heuristics(multigraph, goal, time_weight, price_weight):
    goal_pos = multigraph.nodes[goal]
    heuristic_dict = {}
    for node in multigraph.nodes():
        if node == goal:
            heuristic_dict[node] = 0
            continue
        node_pos = multigraph.nodes[node]
        dist = haversine(node_pos['latitude'], node_pos['longitude'], 
                         goal_pos['latitude'], goal_pos['longitude'])
        time_est = dist / 800  # Fastest mode (air)
        price_est = dist * 0.00002  # Cheapest mode (sea)
        time_norm = (time_est - time_min) / (time_max - time_min) * 1000
        price_norm = (price_est - price_min) / (price_max - price_min) * 1000
        heuristic_dict[node] = time_weight * time_norm + price_weight * price_norm
    return heuristic_dict

def astar_top_n_avoid_countries(multigraph, start, goal, avoid_countries=None, penalty_countries=None, top_n=3, time_weight=0.3, price_weight=0.3, allowed_modes=['land','sea','air']):
    if start not in multigraph or goal not in multigraph:
        return {"error": "Start or goal node not in graph"}
    
    avoid_countries = set(avoid_countries) if avoid_countries else set()
    penalty_countries = set(penalty_countries) if penalty_countries else set()
    if (multigraph.nodes[start].get('country_code') in avoid_countries or 
        multigraph.nodes[goal].get('country_code') in avoid_countries):
        return {"error": f"No valid route: Start ({start}) or goal ({goal}) is in a banned country."}
    
    heuristic_dict = precompute_heuristics(multigraph, goal, time_weight, price_weight)
    queue = [(0, 0, 0, start, [start], [])]
    visited = set()
    counter = 0
    completed_paths = []
    
    while queue:
        f_cost, g_cost, _, current, path, edge_details = heapq.heappop(queue)
        if current == goal:
            completed_paths.append((path, edge_details, g_cost))
            if len(completed_paths) >= top_n:
                completed_paths.sort(key=lambda x: x[2])
                if f_cost > completed_paths[top_n-1][2]:
                    break
            continue
        
        if current in visited:
            continue
        visited.add(current)
        
        for u, neighbor, key, data in multigraph.edges(current, keys=True, data=True):
            if data['mode'] not in allowed_modes:
                continue
            neighbor_country = multigraph.nodes[neighbor].get('country_code', '')
            current_country = multigraph.nodes[current].get('country_code', '')
            if neighbor in path or neighbor_country in avoid_countries:
                continue
            if neighbor_country in penalty_countries:
                restricted_penalty = 1
            else:
                restricted_penalty = 0
     
            border_penalty = 1 if current_country != neighbor_country else 0

            new_g_cost = g_cost + time_weight*data['time_norm'] + price_weight*data['price_norm'] + border_penalty + restricted_penalty
            h_cost = heuristic_dict[neighbor]
            new_f_cost = new_g_cost + h_cost

            new_path = path + [neighbor]
            new_edge_details = edge_details + [(current, neighbor, key, data)]

            counter += 1
            heapq.heappush(queue, (new_f_cost, new_g_cost, counter, neighbor, new_path, new_edge_details))
    
    completed_paths.sort(key=lambda x: x[2])
    if not completed_paths:
        return {"error": f"No paths found between {start} and {goal} with selected parameters."}
    print(completed_paths)
    return [{
        "path": path,
        "edges": [{
            "from": edge[0], "to": edge[1], "mode": edge[3]['mode'],
            "time": edge[3]['time'], "price": edge[3]['price'], "distance": edge[3]['distance']
        } for edge in edges],
        "time_sum": sum(edge[3]['time'] for edge in edges),
        "price_sum": sum(edge[3]['price'] for edge in edges),
        "distance_sum": sum(edge[3]['distance'] for edge in edges),
        "CO2_sum": sum(edge[3]['distance'] * EMISSION_FACTORS[edge[3]['mode']] for edge in edges)
    } for path, edges, cost in completed_paths[:top_n]]

def make_avoid_list(description,prohibited_flag,restricted_flag):
    if prohibited_flag == "ignore" and restricted_flag == "ignore":
        return {}
    response=find_prohibited.ask_gemini(description)
    result_dict=json.loads(response)
    if prohibited_flag == "ignore" and restricted_flag == "penalty":
        return {'penalty_countries':result_dict['restricted_in']}
    elif prohibited_flag == "ignore" and restricted_flag == "avoid":
        return {'avoid_countries':result_dict['restricted_in']}
    elif prohibited_flag == "avoid" and restricted_flag == "ignore":
        return {'avoid_countries':result_dict['prohibited_in']}
    elif prohibited_flag == "avoid" and restricted_flag == "penalty":
        return {'penalty_countries':result_dict['restricted_in'],"avoid_countries":result_dict['prohibited_in']}
    elif prohibited_flag == "avoid" and restricted_flag == "avoid":
        return {'avoid_countries':result_dict['prohibited_in'] + result_dict['restricted_in']}



from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import pickle

app = FastAPI()

# Load the graph
with open(r'C:\Users\Asus\Desktop\RouteSyncAI\RouteSyncAI\backend\graph_final_5_precalc.pkl', "rb") as G:
    roadsn = pickle.load(G)


# Define request model
class PathRequest(BaseModel):
    start: str
    goal: str
    avoid_countries: Optional[List[str]] = []
    top_n: int = Field(3, gt=0)
    time_weight: float = Field(0.5, ge=0.0, le=1.0)
    price_weight: float = Field(0.5, ge=0.0, le=1.0)
    allowed_modes: List[str] = ["land", "sea", "air"]
    prohibited_flag: Literal["ignore", "avoid"] = "ignore"
    restricted_flag: Literal["ignore", "avoid","penalty"] = "ignore"
    description: str

@app.post("/find_paths/")
async def find_paths(request: PathRequest):
    # Ensure time_weight + price_weight sums to 1
    if round(request.time_weight + request.price_weight, 5) != 1.0:
        raise HTTPException(status_code=400, detail="time_weight and price_weight must sum to 1")

    combined_dict=make_avoid_list(request.description,request.prohibited_flag,request.restricted_flag)
    paths = astar_top_n_avoid_countries(
        roadsn,
        start=request.start,
        goal=request.goal,
        avoid_countries=request.avoid_countries+ combined_dict.get('avoid_countries', []),
        penalty_countries=combined_dict.get('penalty_countries', []),
        top_n=request.top_n,
        time_weight=request.time_weight,
        price_weight=request.price_weight,
        allowed_modes=request.allowed_modes
    )

    return {"avoided_countries":request.avoid_countries+ combined_dict.get('avoid_countries', []),"penalty_countries":combined_dict.get('penalty_countries', []),"paths": paths}

