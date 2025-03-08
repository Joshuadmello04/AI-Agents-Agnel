export interface RouteEdge {
    from: string
    to: string
    mode: string
    time: number
    price: number
    distance: number
  }
  
  export interface RoutePath {
    path: string[]
    edges: RouteEdge[]
    time_sum: number
    price_sum: number
    distance_sum: number
    CO2_sum: number
  }
  
  export interface RouteResponse {
    avoided_countries: string[]
    penalty_countries: string[]
    paths: RoutePath[] | { error: string }
  }