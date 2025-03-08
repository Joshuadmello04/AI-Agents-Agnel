"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Bus, MapPin, Search, Loader2 } from "lucide-react"
import * as maptilersdk from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"

// Sample shipment data for London to Paris route
const SAMPLE_SHIPMENT = {
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
    },
    {
      id: "dover",
      title: "Dover Ferry Port",
      location: "Dover, UK 🇬🇧",
      coordinates: [1.3089, 51.1279],
      time: "2024-04-10 10:30 BST",
      description: "Arrived at ferry port",
    },
    {
      id: "calais",
      title: "Calais Ferry Port",
      location: "Calais, France 🇫🇷",
      coordinates: [1.8558, 50.9513],
      time: "2024-04-10 12:30 CEST",
      description: "Cleared customs",
    },
    {
      id: "arrival",
      title: "Arrival",
      location: "Paris Bercy Station 🇫🇷",
      coordinates: [2.3833, 48.8403],
      time: "2024-04-10 16:00 CEST",
      description: "Package arrived at destination",
    },
  ],
}

const ShipmentTracker = () => {
  const [isTracking, setIsTracking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [shipmentId, setShipmentId] = useState("BUS123456")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [busMarker, setBusMarker] = useState<maptilersdk.Marker | null>(null)

  const mapContainer = useRef(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const animationFrame = useRef<number | null>(null)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    maptilersdk.config.apiKey = "WPOrYvLmOvXmyuTyNP5h"
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

        if (busMarker) {
          busMarker.remove()
        }

        map.current.remove()
        map.current = null
      }

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  interface BusMarkerElement extends HTMLDivElement {
    innerHTML: string;
  }

  const createBusMarker = (coordinates: [number, number]): maptilersdk.Marker | null => {
    if (!map.current) return null;

    const el: BusMarkerElement = document.createElement("div") as BusMarkerElement;
    el.className = "bus-marker";

    el.innerHTML = `
    <div class="p-2 bg-blue-500 rounded-full shadow-lg transform-gpu transition-transform hover:scale-110">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6v12m8-12v12M3 12h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>
        <circle cx="7" cy="18" r="1"/><circle cx="17" cy="18" r="1"/>
      </svg>
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
          "#FBBC04", // Yellow for intermediate stops
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    })
  }

  interface Step {
    id: string;
    title: string;
    location: string;
    coordinates: [number, number];
    time: string;
    description: string;
  }

  interface Shipment {
    id: string;
    origin: string;
    originCoords: [number, number];
    destination: string;
    destinationCoords: [number, number];
    steps: Step[];
  }

  const SAMPLE_SHIPMENT: Shipment = {
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
      },
      {
        id: "dover",
        title: "Dover Ferry Port",
        location: "Dover, UK 🇬🇧",
        coordinates: [1.3089, 51.1279],
        time: "2024-04-10 10:30 BST",
        description: "Arrived at ferry port",
      },
      {
        id: "calais",
        title: "Calais Ferry Port",
        location: "Calais, France 🇫🇷",
        coordinates: [1.8558, 50.9513],
        time: "2024-04-10 12:30 CEST",
        description: "Cleared customs",
      },
      {
        id: "arrival",
        title: "Arrival",
        location: "Paris Bercy Station 🇫🇷",
        coordinates: [2.3833, 48.8403],
        time: "2024-04-10 16:00 CEST",
        description: "Package arrived at destination",
      },
    ],
  };

  const generateRoutePoints = (steps: Step[]): [number, number][] => {
    const points: [number, number][] = [];

    for (let i = 0; i < steps.length - 1; i++) {
      const start = steps[i].coordinates;
      const end = steps[i + 1].coordinates;
      const pointCount = 50; // More points for smoother animation

      for (let j = 0; j <= pointCount; j++) {
        const fraction = j / pointCount;
        const lat = start[1] + (end[1] - start[1]) * fraction;
        const lng = start[0] + (end[0] - start[0]) * fraction;
        points.push([lng, lat]);
      }
    }

    return points;
  };

  const updateBusPosition = (coordinates: [number, number]) => {
    if (!map.current) return;

    if (busMarker) {
      busMarker.setLngLat(coordinates);
    } else {
      const newMarker = createBusMarker(coordinates);
      if (newMarker) {
        newMarker.addTo(map.current);
        setBusMarker(newMarker);
      }
    }
  };

  const animateShipment = () => {
    const routePoints = generateRoutePoints(SAMPLE_SHIPMENT.steps)
    let currentPoint = 0

    // Draw the complete route first
    drawRoute()

    // Create the bus marker if it doesn't exist
    if (!busMarker) {
      const newMarker = createBusMarker(routePoints[0])
      if (newMarker && map.current) {
        newMarker.addTo(map.current)
        setBusMarker(newMarker)
      }
    }

    const animate = () => {
      if (currentPoint >= routePoints.length) {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current)
        }
        return
      }

      const point = routePoints[currentPoint]
      const progress = (currentPoint / routePoints.length) * 100

      // Update bus position instead of creating a new marker each time
      updateBusPosition(point)

      if (map.current && currentPoint % 10 === 0) {
        map.current.easeTo({
          center: point,
          duration: 2000,
          zoom: 7,
        })
      }

      setProgress(progress)
      setCurrentStep(Math.floor((currentPoint / routePoints.length) * (SAMPLE_SHIPMENT.steps.length - 1)))
      currentPoint++

      setTimeout(() => {
        animationFrame.current = requestAnimationFrame(animate)
      }, 100)
    }

    animate()
  }

  const handleTrackShipment = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsTracking(true)
      setCurrentStep(0)
      setProgress(0)

      // Clear any existing bus marker
      if (busMarker) {
        busMarker.remove()
        setBusMarker(null)
      }

      // Clear any existing route
      if (map.current && map.current.getLayer("route")) {
        map.current.removeLayer("route")
        map.current.removeSource("route")
      }

      if (map.current && map.current.getLayer("stops")) {
        map.current.removeLayer("stops")
        map.current.removeSource("stops")
      }

      if (map.current) {
        map.current.flyTo({
          center: SAMPLE_SHIPMENT.originCoords,
          zoom: 7,
          duration: 2000,
        })
      }

      setTimeout(animateShipment, 2000)
    } finally {
      setIsLoading(false)
    }
  }

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
              Track Your Bus Shipment
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
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bus className="mr-2 h-5 w-5" />}
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
                    {index === 0 ? <MapPin /> : index === SAMPLE_SHIPMENT.steps.length - 1 ? <MapPin /> : <Bus />}
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
              <Bus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">Enter tracking number to start</p>
              <p className="text-sm text-gray-500 mt-2">Track your bus shipment in real-time</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ShipmentTracker

