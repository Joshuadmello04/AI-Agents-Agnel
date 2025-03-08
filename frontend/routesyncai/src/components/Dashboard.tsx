"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AlertCircle, TrendingUp, Truck, RefreshCw } from "lucide-react";

// Types
interface Shipment {
  id: string;
  origin: string;
  destination: string;
  cargo_weight: number;
  cargo_volume: number;
  priority: string;
  createdAt: string;
  status: string;
  userId: string;
}

interface Disaster {
  type?: string;
  location?: string;
  severity?: number;
  date?: string;
  impact?: string;
}

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
}

interface WeatherForecast {
  day: string;
  condition: string;
  temperature: number;
  precipitation: number;
}

interface RouteOption {
  id: string;
  routeType: string;
  carrier: string;
  transitTime: number;
  cost: number;
  borderCrossings: number;
  co2Emissions: number;
  reliability: number;
  score: number;
}

interface CurrencyResponse {
  provider: string;
  terms: string;
  base: string;
  date: string;
  time_last_updated: number;
  rates: Record<string, number>;
}

interface WeatherItem {
  dt_txt: string;
  weather: Array<{ main: string }>;
  main: { temp: number };
  pop: number;
}

// Custom Hooks
const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch("/api/shipments");
        if (!response.ok) throw new Error("Failed to fetch shipments");
        const data = await response.json();
        setShipments(data);
      } catch (err) {
        setError("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  return { shipments, loading, error };
};

const useDisasters = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/gdacs");
        if (!response.ok) throw new Error("Failed to fetch disasters");
        const data = await response.json();

        // Map the API response to the Disaster interface
        const mappedDisasters = data.events.features.map((feature: any) => ({
          type: feature.properties.eventtype || "Unknown",
          location: feature.properties.country || "Unknown",
          severity: feature.properties.severitydata?.severity || 1,
          date: feature.properties.fromdate || new Date().toISOString(),
          impact: feature.properties.name || "Unknown",
        }));

        setDisasters(mappedDisasters);
      } catch (err) {
        setError("Failed to load disasters");
      } finally {
        setLoading(false);
      }
    };
    fetchDisasters();
  }, []);

  return { disasters, loading, error };
};

const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/INR"
        );
        if (!response.ok) throw new Error("Failed to fetch currencies");
        const data: CurrencyResponse = await response.json();

        const majorCurrencies = [
          "USD",
          "EUR",
          "GBP",
          "JPY",
          "CNY",
          "CAD",
          "AUD",
          "CHF",
          "HKD",
          "SGD",
          "INR",
        ];
        setCurrencies(
          Object.entries(data.rates)
            .filter(([code]) => majorCurrencies.includes(code))
            .map(([code, rate]) => ({
              code,
              name: getCurrencyName(code),
              rate,
              change: Math.random() * 2 - 1, // Mock change for demo
            }))
        );
      } catch (err) {
        setError("Failed to load currencies");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  return { currencies, loading, error };
};

const useWeather = () => {
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!weatherApiKey) throw new Error("Weather API key is missing");

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${weatherApiKey}`
        );
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();

        const dailyForecasts = data.list
          .filter((_: WeatherItem, index: number) => index % 8 === 0) // Get one forecast per day
          .map((item: WeatherItem) => ({
            day: new Date(item.dt_txt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            condition: item.weather[0].main,
            temperature: kelvinToCelsius(item.main.temp),
            precipitation: Math.round(item.pop * 100),
          }));

        setWeather(dailyForecasts);
      } catch (err) {
        setError("Failed to load weather");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return { weather, loading, error };
};

// Helper functions
const kelvinToCelsius = (kelvin: number) => {
  return Math.round((kelvin - 273.15) * 10) / 10;
};

const getCurrencyName = (code: string) => {
  const currencyNames: Record<string, string> = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CNY: "Chinese Yuan",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    CHF: "Swiss Franc",
    HKD: "Hong Kong Dollar",
    SGD: "Singapore Dollar",
    INR: "Indian Rupee",
  };
  return currencyNames[code] || code;
};

// Dashboard Component
const Dashboard = () => {
  const {
    shipments,
    loading: shipmentsLoading,
    error: shipmentsError,
  } = useShipments();
  const {
    disasters,
    loading: disastersLoading,
    error: disastersError,
  } = useDisasters();
  const {
    currencies,
    loading: currenciesLoading,
    error: currenciesError,
  } = useCurrencies();
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather();

  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch route options when a shipment is selected
  useEffect(() => {
    if (selectedShipment) {
      const fetchRouteOptions = async () => {
        try {
          const response = await fetch(
            `/api/route-options?shipmentId=${selectedShipment}`
          );
          if (!response.ok) throw new Error("Failed to fetch route options");
          const data = await response.json();
          setRouteOptions(data);
        } catch (error) {
          console.error("Error fetching route options:", error);
          setRouteOptions([]);
        }
      };
      fetchRouteOptions();
    } else {
      setRouteOptions([]);
    }
  }, [selectedShipment]);

  // Mock data for charts
  const weeklyShipmentData = [
    { name: "Mon", shipments: 12 },
    { name: "Tue", shipments: 19 },
    { name: "Wed", shipments: 15 },
    { name: "Thu", shipments: 22 },
    { name: "Fri", shipments: 27 },
    { name: "Sat", shipments: 10 },
    { name: "Sun", shipments: 8 },
  ];

  // Derive cost by priority data
  const getCostByPriorityData = () => {
    const priorityCosts: Record<string, number> = {};

    shipments.forEach((shipment) => {
      const key = shipment.priority;
      if (priorityCosts[key]) {
        priorityCosts[key] += shipment.cargo_weight; // Use cargo_weight as a placeholder for cost
      } else {
        priorityCosts[key] = shipment.cargo_weight;
      }
    });

    return Object.entries(priorityCosts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // You can add logic to refetch data here if needed
    setRefreshing(false);
  };

  if (
    shipmentsLoading ||
    disastersLoading ||
    currenciesLoading ||
    weatherLoading
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Shipping Logistics Dashboard</h1>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {(shipmentsError ||
        disastersError ||
        currenciesError ||
        weatherError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {shipmentsError ||
              disastersError ||
              currenciesError ||
              weatherError}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="shipments">
        <TabsList className="mb-4">
          <TabsTrigger value="shipments" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Shipments
          </TabsTrigger>
          <TabsTrigger value="disasters" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Disasters
          </TabsTrigger>
          <TabsTrigger value="currencies" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Currencies
          </TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipments</CardTitle>
              <CardDescription>
                Manage and track your shipments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shipments.length === 0 ? (
                <div className="text-center py-4">No shipments found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Cargo Weight</TableHead>
                        <TableHead>Cargo Volume</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>User ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>{shipment.id}</TableCell>
                          <TableCell>{shipment.origin}</TableCell>
                          <TableCell>{shipment.destination}</TableCell>
                          <TableCell>{shipment.cargo_weight} kg</TableCell>
                          <TableCell>{shipment.cargo_volume} m³</TableCell>
                          <TableCell>{shipment.priority}</TableCell>
                          <TableCell>
                            {new Date(shipment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                shipment.status === "DELIVERED"
                                  ? "bg-green-500"
                                  : shipment.status === "IN_TRANSIT"
                                  ? "bg-blue-500"
                                  : shipment.status === "PENDING"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{shipment.userId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disasters">
          <Card>
            <CardHeader>
              <CardTitle>Disasters</CardTitle>
              <CardDescription>
                Recent natural disasters that may impact shipments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {disasters.length === 0 ? (
                <div className="text-center py-4">
                  No disaster data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disasters.map((disaster, index) => (
                        <TableRow
                          key={`${disaster.type}-${disaster.location}-${index}`}
                        >
                          <TableCell>{disaster.type}</TableCell>
                          <TableCell>{disaster.location}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                Number(disaster.severity) > 2
                                  ? "bg-red-500"
                                  : Number(disaster.severity) > 1
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                              } text-white`}
                            >
                              {Number(disaster.severity).toFixed(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              disaster.date || new Date().toISOString()
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{disaster.impact}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies">
          <Card>
            <CardHeader>
              <CardTitle>Currencies</CardTitle>
              <CardDescription>
                Current currency exchange rates relative to USD.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currencies.length === 0 ? (
                <div className="text-center py-4">
                  No currency data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Rate (USD)</TableHead>
                        <TableHead>24h Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currencies.map((currency) => (
                        <TableRow key={currency.code}>
                          <TableCell className="font-medium">
                            {currency.code}
                          </TableCell>
                          <TableCell>{currency.name}</TableCell>
                          <TableCell>{currency.rate.toFixed(4)}</TableCell>
                          <TableCell>
                            <span
                              className={
                                currency.change > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {currency.change > 0 ? "+" : ""}
                              {currency.change.toFixed(2)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather">
          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
              <CardDescription>
                5-day weather forecast for London.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weather.length === 0 ? (
                <div className="text-center py-4">
                  No weather data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Temperature</TableHead>
                        <TableHead>Precipitation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weather.map((forecast, index) => (
                        <TableRow key={index}>
                          <TableCell>{forecast.day}</TableCell>
                          <TableCell>{forecast.condition}</TableCell>
                          <TableCell>{forecast.temperature}°C</TableCell>
                          <TableCell>{forecast.precipitation}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Shipments</CardTitle>
            <CardDescription>
              Number of shipments processed by day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyShipmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shipments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost by Priority</CardTitle>
            <CardDescription>
              Distribution of shipping costs by priority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCostByPriorityData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {getCostByPriorityData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
