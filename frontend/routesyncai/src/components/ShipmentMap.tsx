"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Bus, MapPin, Search, Loader2, Ship, Plane } from "lucide-react"
import * as maptilersdk from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"

// Sample shipment data for London to Paris route
const SAMPLE_SHIPMENT: {
  id: string;
  origin: string;
  originCoords: [number, number];
  destination: string;
  destinationCoords: [number, number];
  steps: Step[];
} = {
  id: "BUS123456",
  origin: "London, UK",
  originCoords: [-0.1276, 51.5074],
  destination: "Paris, France",
  destinationCoords: [2.3522, 48.8566],
  steps: [
    {
      id: "pickup",
      title: "Departure",
      location: "London Victoria Coach Station 🇬🇧",
      coordinates: [-0.144, 51.4945],
      time: "2024-04-10 08:00 BST",
      description: "Package loaded on bus",
      terrainType: "land",
    },
    {
      id: "dover",
      title: "Dover Ferry Port",
      location: "Dover, UK 🇬🇧",
      coordinates: [1.3089, 51.1279],
      time: "2024-04-10 10:30 BST",
      description: "Arrived at ferry port",
      terrainType: "land",
    },
    {
      id: "english_channel",
      title: "English Channel",
      location: "English Channel 🌊",
      coordinates: [1.5, 51.0],
      time: "2024-04-10 11:30 CEST",
      description: "Crossing the English Channel",
      terrainType: "water",
    },
    {
      id: "calais",
      title: "Calais Ferry Port",
      location: "Calais, France 🇫🇷",
      coordinates: [1.8558, 50.9513],
      time: "2024-04-10 12:30 CEST",
      description: "Cleared customs",
      terrainType: "land",
    },
    {
      id: "arrival",
      title: "Arrival",
      location: "Paris Bercy Station 🇫🇷",
      coordinates: [2.3833, 48.8403],
      time: "2024-04-10 16:00 CEST",
      description: "Package arrived at destination",
      terrainType: "land",
    },
  ],
}

// Define interfaces
interface Step {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number];
  time: string;
  description: string;
  terrainType: "land" | "water" | "air";
}


interface RoutePoint {
  coordinates: [number, number];
  terrainType: "land" | "water" | "air";
}

const ShipmentTracker = () => {
  const [isTracking, setIsTracking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [shipmentId, setShipmentId] = useState("BUS123456")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleMarker, setVehicleMarker] = useState<maptilersdk.Marker | null>(null)
  const [currentTerrainType, setCurrentTerrainType] = useState<"land" | "water" | "air">("land")

  const mapContainer = useRef(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const animationFrame = useRef<number | null>(null)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (apiKey) {
      maptilersdk.config.apiKey = apiKey;
    } else {
      console.error("MapTiler API key is not defined");
    }
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [1.0, 50.0], // Center between London and Paris
      zoom: 6,
    })

    // Wait for map to load before adding layers
    map.current.on("load", () => {
      // Map is ready
    })

    return () => {
      if (map.current) {
        // Clean up any layers and sources
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route")
          map.current.removeSource("route")
        }

        if (map.current.getLayer("stops")) {
          map.current.removeLayer("stops")
          map.current.removeSource("stops")
        }

        if (vehicleMarker) {
          vehicleMarker.remove()
        }

        map.current.remove()
        map.current = null
      }

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  const createVehicleMarker = (coordinates: [number, number], terrainType: "land" | "water" | "air"): maptilersdk.Marker | null => {
    if (!map.current) return null;

    const el = document.createElement("div");
    el.className = "vehicle-marker";

    // Choose icon based on terrain type
    let iconSvg = "";
    let bgColor = "";
    
    if (terrainType === "water") {
      // Ship icon
      iconSvg = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 20a6 6 0 0 0 12 0c0-4-2.5-6-6-12-3.5 6-6 8-6 12z"></path>
          <path d="M12 12l8.5 8.5"></path>
          <path d="M19 15l-8.5-8.5"></path>
          <path d="M15 19l-8.5-8.5"></path>
        </svg>`;
      bgColor = "bg-blue-600";
    } else if (terrainType === "air") {
      // Plane icon
      iconSvg = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
        </svg>`;
      bgColor = "bg-purple-600";
    } else {
      // Bus icon
      iconSvg = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v12m8-12v12M3 12h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"></path>
          <circle cx="7" cy="18" r="1"></circle><circle cx="17" cy="18" r="1"></circle>
        </svg>`;
      bgColor = "bg-green-500";
    }

    el.innerHTML = `
      <div class="p-2 ${bgColor} rounded-full shadow-lg transform-gpu transition-transform hover:scale-110">
        ${iconSvg}
      </div>
    `;

    return new maptilersdk.Marker({
      element: el,
      anchor: "center",
    }).setLngLat(coordinates);
  };

  const drawRoute = () => {
    if (!map.current) return

    // Remove existing route if any
    if (map.current.getLayer("route")) {
      map.current.removeLayer("route")
      map.current.removeSource("route")
    }

    // Create a GeoJSON source with the route coordinates
    const routeCoordinates = SAMPLE_SHIPMENT.steps.map((step) => step.coordinates)

    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates,
        },
      },
    })

    // Add a layer to display the route
    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#4285F4",
        "line-width": 6,
        "line-opacity": 0.8,
      },
    })

    // Add stop markers
    addStopMarkers()
  }

  const addStopMarkers = () => {
    if (!map.current) return

    // Remove existing markers if any
    if (map.current.getLayer("stops")) {
      map.current.removeLayer("stops")
      map.current.removeSource("stops")
    }

    // Create a GeoJSON source with stop points
    map.current.addSource("stops", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: SAMPLE_SHIPMENT.steps.map((step, index) => ({
          type: "Feature",
          properties: {
            title: step.title,
            description: step.description,
            isOrigin: index === 0,
            isDestination: index === SAMPLE_SHIPMENT.steps.length - 1,
            terrainType: step.terrainType,
          },
          geometry: {
            type: "Point",
            coordinates: step.coordinates,
          },
        })),
      },
    })

    // Add a layer for the stops
    map.current.addLayer({
      id: "stops",
      type: "circle",
      source: "stops",
      paint: {
        "circle-radius": 8,
        "circle-color": [
          "case",
          ["==", ["get", "isOrigin"], true],
          "#34A853", // Green for origin
          ["==", ["get", "isDestination"], true],
          "#EA4335", // Red for destination
          ["==", ["get", "terrainType"], "water"],
          "#1E88E5", // Blue for water stops
          "#FBBC04", // Yellow for other intermediate stops
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    })
  }

  const generateRoutePoints = (steps: Step[]): RoutePoint[] => {
    const points: RoutePoint[] = [];

    for (let i = 0; i < steps.length - 1; i++) {
      const start = steps[i];
      const end = steps[i + 1];
      const pointCount = 50; // More points for smoother animation

      for (let j = 0; j <= pointCount; j++) {
        const fraction = j / pointCount;
        const lat = start.coordinates[1] + (end.coordinates[1] - start.coordinates[1]) * fraction;
        const lng = start.coordinates[0] + (end.coordinates[0] - start.coordinates[0]) * fraction;
        
        // Determine terrain type for this intermediate point
        let terrainType: "land" | "water" | "air";
        
        // If we're going from land to water or water to land, determine where to transition
        if (start.terrainType !== end.terrainType) {
          // Simple approach: transition halfway between the points
          // A more sophisticated approach could use GeoJSON data to determine water boundaries
          terrainType = j < pointCount / 2 ? start.terrainType : end.terrainType;
        } else {
          terrainType = start.terrainType;
        }
        
        points.push({
          coordinates: [lng, lat],
          terrainType,
        });
      }
    }

    return points;
  };

  const updateVehiclePosition = (coordinates: [number, number], terrainType: "land" | "water" | "air") => {
    if (!map.current) return;

    // If terrain type has changed or vehicle marker doesn't exist, create a new one
    if (terrainType !== currentTerrainType || !vehicleMarker) {
      // Remove existing marker if there is one
      if (vehicleMarker) {
        vehicleMarker.remove();
      }
      
      // Create new marker with appropriate vehicle icon
      const newMarker = createVehicleMarker(coordinates, terrainType);
      if (newMarker) {
        newMarker.addTo(map.current);
        setVehicleMarker(newMarker);
      }
      
      // Update current terrain type
      setCurrentTerrainType(terrainType);
    } else {
      // Just update position if terrain type hasn't changed
      vehicleMarker.setLngLat(coordinates);
    }
  };

  const animateShipment = () => {
    const routePoints = generateRoutePoints(SAMPLE_SHIPMENT.steps);
    let currentPoint = 0;

    // Draw the complete route first
    drawRoute();

    const animate = () => {
      if (currentPoint >= routePoints.length) {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
        return;
      }

      const point = routePoints[currentPoint];
      const progress = (currentPoint / routePoints.length) * 100;

      // Update vehicle icon and position based on terrain
      updateVehiclePosition(point.coordinates, point.terrainType);

      if (map.current && currentPoint % 10 === 0) {
        map.current.easeTo({
          center: point.coordinates,
          duration: 2000,
          zoom: 7,
        });
      }

      setProgress(progress);
      
      // Calculate current step based on progress
      setCurrentStep(Math.floor((currentPoint / routePoints.length) * (SAMPLE_SHIPMENT.steps.length - 1)));
      
      currentPoint++;

      setTimeout(() => {
        animationFrame.current = requestAnimationFrame(animate);
      }, 100);
    };

    animate();
  };

  const handleTrackShipment = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsTracking(true);
      setCurrentStep(0);
      setProgress(0);

      // Clear any existing vehicle marker
      if (vehicleMarker) {
        vehicleMarker.remove();
        setVehicleMarker(null);
      }

      // Reset current terrain type
      setCurrentTerrainType("land");

      // Clear any existing route
      if (map.current && map.current.getLayer("route")) {
        map.current.removeLayer("route");
        map.current.removeSource("route");
      }

      if (map.current && map.current.getLayer("stops")) {
        map.current.removeLayer("stops");
        map.current.removeSource("stops");
      }

      if (map.current) {
        map.current.flyTo({
          center: SAMPLE_SHIPMENT.originCoords,
          zoom: 7,
          duration: 2000,
        });
      }

      setTimeout(animateShipment, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleTrackShipment()
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="shipmentId" className="text-lg font-semibold">
              Track Your Shipment
            </Label>
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="shipmentId"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                placeholder="Enter tracking number"
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Package className="mr-2 h-5 w-5" />}
            {isLoading ? "Tracking..." : "Track Shipment"}
          </Button>
        </form>

        {isTracking && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="mr-2" />
                Shipment Progress
              </h3>
              <div className="h-2 bg-blue-100 rounded-full">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Current Status</p>
                  <p className="font-medium">{SAMPLE_SHIPMENT.steps[currentStep].title}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Location</p>
                  <p className="font-medium">{SAMPLE_SHIPMENT.steps[currentStep].location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {SAMPLE_SHIPMENT.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${index === currentStep ? "bg-blue-50" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index < currentStep
                        ? "bg-green-600 text-white"
                        : index === currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                    }`}
                  >
                    {step.terrainType === "water" ? (
                      <Ship size={20} />
                    ) : step.terrainType === "air" ? (
                      <Plane size={20} />
                    ) : index === 0 || index === SAMPLE_SHIPMENT.steps.length - 1 ? (
                      <MapPin size={20} />
                    ) : (
                      <Bus size={20} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{step.title}</p>
                      <Badge variant="secondary">
                        {index < currentStep ? "Completed" : index === currentStep ? "Current" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{step.location}</p>
                    <p className="text-xs text-gray-500">{step.time}</p>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>

      <Card className="p-0 overflow-hidden h-[700px] relative">
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
        {!isTracking && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
            <div className="text-center p-6">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">Enter tracking number to start</p>
              <p className="text-sm text-gray-500 mt-2">Track your shipment in real-time</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ShipmentTracker