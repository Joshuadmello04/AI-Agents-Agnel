"use client";

import { useState } from "react";
import { MapPin, Clock, DollarSign, Truck, Ship, Plane, AlertTriangle } from "lucide-react";

interface RouteEdge {
  from: string;
  to: string;
  mode: string;
  time: number;
  price: number;
  distance: number;
}

interface RoutePath {
  path: string[];
  edges: RouteEdge[];
  time_sum: number;
  price_sum: number;
  distance_sum: number;
  CO2_sum: number;
}

interface RouteResponse {
  avoided_countries: string[];
  penalty_countries: string[];
  paths: RoutePath[] | { error: string };
}

export default function Home() {
  const [formData, setFormData] = useState({
    start: "",
    goal: "",
    avoid_countries: [] as string[],
    top_n: 3,
    time_weight: 0.5,
    price_weight: 0.5,
    allowed_modes: ["land", "sea", "air"],
    prohibited_flag: "avoid",
    restricted_flag: "avoid",
    description: "",
  });

  const [routes, setRoutes] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/find_paths/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }

      const data = await response.json();
      
      // Check if the response contains an error
      if ('error' in data) {
        setError(data.error);
        setRoutes(null);
      } else {
        setRoutes(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRoutes(null);
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case "land":
        return <Truck className="w-4 h-4" />;
      case "sea":
        return <Ship className="w-4 h-4" />;
      case "air":
        return <Plane className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Route Finder</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Location</label>
                  <input
                    type="text"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cargo Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.time_weight}
                    onChange={(e) => {
                      const timeWeight = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        time_weight: timeWeight,
                        price_weight: 1 - timeWeight,
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.price_weight}
                    onChange={(e) => {
                      const priceWeight = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        price_weight: priceWeight,
                        time_weight: 1 - priceWeight,
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Finding Routes..." : "Find Routes"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {routes && Array.isArray(routes.paths) && (
              <div className="space-y-6">
                {routes.avoided_countries.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="font-medium">Avoided Countries:</span>
                    </div>
                    <p className="mt-1 text-sm">{routes.avoided_countries.join(", ")}</p>
                  </div>
                )}

                {routes.paths.map((route, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Route {index + 1}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{route.time_sum.toFixed(2)}h</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">${route.price_sum.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Distance</p>
                          <p className="font-medium">{route.distance_sum.toFixed(2)}km</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">CO2</p>
                          <p className="font-medium">{route.CO2_sum.toFixed(2)}kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {route.edges.map((edge, edgeIndex) => (
                        <div key={edgeIndex} className="flex items-center space-x-2 text-sm">
                          <span>{edge.from}</span>
                          <div className="flex-shrink-0">
                            {getTransportIcon(edge.mode)}
                          </div>
                          <span>{edge.to}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}