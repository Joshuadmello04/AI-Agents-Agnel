"use client";

import { useState } from "react";
import { AlertTriangle, Box, Navigation } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteMap } from "@/components/route-map";
import { RouteList } from "@/components/route-list";
import type { RouteResponse } from "@/lib/types";

// Define cargo type options
const CARGO_TYPES = [
  { value: "general", label: "General Merchandise" },
  { value: "perishable", label: "Perishable Goods" },
  { value: "hazardous", label: "Hazardous Materials" },
  { value: "fragile", label: "Fragile Items" },
  { value: "bulk", label: "Bulk Goods" },
  { value: "liquid", label: "Liquid Cargo" },
];

// Transport modes
const TRANSPORT_MODES = [
  { value: "land", label: "Land" },
  { value: "sea", label: "Sea" },
  { value: "air", label: "Air" },
];

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
    cargo_type: "general",
    weight: 0,
  });

  const [countryInput, setCountryInput] = useState("");
  const [routes, setRoutes] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);

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
      if ('error' in data) {
        setError(data.error);
        setRoutes(null);
      } else {
        setRoutes(data);
        setSelectedRoute(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRoutes(null);
    } finally {
      setLoading(false);
    }
  };

  // Handler for adding countries to avoid
  const handleAddCountry = () => {
    if (countryInput.trim() && !formData.avoid_countries.includes(countryInput.trim().toUpperCase())) {
      setFormData({
        ...formData,
        avoid_countries: [...formData.avoid_countries, countryInput.trim().toUpperCase()]
      });
      setCountryInput("");
    }
  };

  // Handler for removing countries from avoid list
  const handleRemoveCountry = (country: string) => {
    setFormData({
      ...formData,
      avoid_countries: formData.avoid_countries.filter(c => c !== country)
    });
  };

  // Handler for transport mode checkboxes
  const handleModeChange = (mode: string) => {
    const currentModes = [...formData.allowed_modes];
    
    if (currentModes.includes(mode)) {
      // Don't allow removing the last transport mode
      if (currentModes.length > 1) {
        setFormData({
          ...formData,
          allowed_modes: currentModes.filter(m => m !== mode)
        });
      }
    } else {
      setFormData({
        ...formData,
        allowed_modes: [...currentModes, mode]
      });
    }
  };

  return (
    <div className="min-h-screen logistics-gradient text-foreground">
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Box className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">LogisticsPro Route Optimizer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card-gradient rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-6">Shipment Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Origin</label>
                    <input
                      type="text"
                      value={formData.start}
                      onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination</label>
                    <input
                      type="text"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cargo Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                    required
                  />
                </div>

                {/* Cargo Type Dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cargo Type</label>
                    <select
                      value={formData.cargo_type}
                      onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                    >
                      {CARGO_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Weight Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                      required
                    />
                  </div>
                </div>

                {/* Number of Routes to Generate */}
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Routes to Generate</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.top_n}
                    onChange={(e) => setFormData({ ...formData, top_n: Number(e.target.value) })}
                    className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                  />
                </div>

                {/* Transportation Mode Checkboxes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Allowed Transportation Modes</label>
                  <div className="flex flex-wrap gap-4">
                    {TRANSPORT_MODES.map((mode) => (
                      <label key={mode.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.allowed_modes.includes(mode.value)}
                          onChange={() => handleModeChange(mode.value)}
                          className="rounded border-gray-300"
                        />
                        <span>{mode.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Countries to Avoid */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Countries to Avoid (ISO-2 codes, e.g., US, CN, DE)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={countryInput}
                      onChange={(e) => setCountryInput(e.target.value.slice(0, 2))}
                      placeholder="Enter country code"
                      className="flex-1 bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                      maxLength={2}
                    />
                    <button
                      type="button"
                      onClick={handleAddCountry}
                      className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.avoid_countries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.avoid_countries.map((country) => (
                        <div key={country} className="bg-secondary/70 text-foreground px-2 py-1 rounded-md flex items-center space-x-1">
                          <span>{country}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCountry(country)}
                            className="text-destructive hover:text-destructive/90 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Time/Cost Priority Slider */}
                <div>
                  <label className="block text-sm font-medium mb-2">Priority Weighting</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.time_weight}
                    onChange={(e) => {
                      const timeWeight = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        time_weight: timeWeight,
                        price_weight: 1 - timeWeight,
                      });
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>Cost Priority</span>
                    <span>Time Priority</span>
                  </div>
                </div>

                {/* Prohibited Flag Option */}
                <div>
                  <label className="block text-sm font-medium mb-2">Prohibited Country Handling</label>
                  <select
                    value={formData.prohibited_flag}
                    onChange={(e) => setFormData({ ...formData, prohibited_flag: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-md p-2 text-foreground"
                  >
                    <option value="avoid">Avoid if possible</option>
                    <option value="strict">Strictly avoid</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Calculating Routes..." : "Calculate Routes"}
                </button>
              </form>
            </div>

            {routes && Array.isArray(routes.paths) && (
              <RouteList
                routes={routes}
                selectedRoute={selectedRoute}
                onRouteSelect={setSelectedRoute}
              />
            )}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ) : routes && Array.isArray(routes.paths) ? (
              <>
                <div className="card-gradient rounded-lg p-6 shadow-xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <Navigation className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Route Visualization</h2>
                  </div>
                  <div className="h-[400px] w-full map-container">
                    <RouteMap route={routes.paths[selectedRoute]} />
                  </div>
                </div>

                <div className="card-gradient rounded-lg p-6 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Route Information</h3>
                  {routes.avoided_countries.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Avoided Countries</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {routes.avoided_countries.join(", ")}
                      </p>
                    </div>
                  )}
                  <div className="space-y-4">
                    {routes.paths[selectedRoute].edges.map((edge, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">{edge.from}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{edge.to}</span>
                        <span className="text-muted-foreground">({edge.mode})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}