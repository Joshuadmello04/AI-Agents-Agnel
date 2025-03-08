"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Clock,
  Plane,
  Ship,
  Truck,
  Calendar,
  MapPin,
  ArrowRight,
  Info,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import * as maptilersdk from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"

// Define TypeScript interfaces for our data structures
interface RouteStep {
  id: string
  title: string
  location: string
  time: string
  coordinates: [number, number]
  vehicle: "truck" | "plane" | "ship"
  description: string
}

interface TrackingEvent {
  date: string
  time: string
  status: string
  location: string
}

interface ShipmentDetails {
  carrier: string
  weight: string
  dimensions: string
  service: string
  estimatedDelivery: string
}

interface ShipmentData {
  origin: string
  originCoords: [number, number]
  destination: string
  destinationCoords: [number, number]
  routeSteps: RouteStep[]
  trackingEvents: TrackingEvent[]
  shipmentDetails: ShipmentDetails
  routePoints?: [number, number][] // Additional points for smoother animation
}

interface ShipmentDatabase {
  [key: string]: ShipmentData
}

// Sample shipment data with enhanced route points for smoother animation
const SAMPLE_SHIPMENTS: ShipmentDatabase = {
  SP56789012: {
    origin: "New York, USA",
    originCoords: [-74.006, 40.7128],
    destination: "Tokyo, Japan",
    destinationCoords: [139.6917, 35.6895],
    routeSteps: [
      {
        id: "pickup",
        title: "Picked up",
        location: "New York, USA 🇺🇸",
        time: "2024-04-10 09:00 EDT",
        coordinates: [-74.006, 40.7128],
        vehicle: "truck",
        description: "Package collected from warehouse",
      },
      {
        id: "airport-departure",
        title: "Departed",
        location: "JFK Airport, USA 🇺🇸",
        time: "2024-04-10 14:30 EDT",
        coordinates: [-73.7781, 40.6413],
        vehicle: "plane",
        description: "Package loaded onto international flight AA194",
      },
      {
        id: "ocean-transit-1",
        title: "In Transit",
        location: "North Atlantic",
        time: "2024-04-11 02:00 UTC",
        coordinates: [-45, 45],
        vehicle: "plane",
        description: "Flying over North Atlantic Ocean",
      },
      {
        id: "ocean-transit-2",
        title: "In Transit",
        location: "Europe",
        time: "2024-04-11 06:00 UTC",
        coordinates: [0, 50],
        vehicle: "plane",
        description: "Flying over Europe",
      },
      {
        id: "ocean-transit-3",
        title: "In Transit",
        location: "Central Asia",
        time: "2024-04-11 10:00 UTC",
        coordinates: [60, 45],
        vehicle: "plane",
        description: "Flying over Central Asia",
      },
      {
        id: "ocean-transit-4",
        title: "In Transit",
        location: "East Asia",
        time: "2024-04-11 14:00 UTC",
        coordinates: [120, 40],
        vehicle: "plane",
        description: "Approaching Japan",
      },
      {
        id: "airport-arrival",
        title: "Arrived",
        location: "Haneda Airport, Japan 🇯🇵",
        time: "2024-04-12 08:45 JST",
        coordinates: [139.7798, 35.5522],
        vehicle: "plane",
        description: "Package cleared customs at Haneda Airport",
      },
      {
        id: "delivery",
        title: "Delivered",
        location: "Tokyo, Japan 🇯🇵",
        time: "2024-04-12 11:30 JST",
        coordinates: [139.6917, 35.6895],
        vehicle: "truck",
        description: "Package delivered to recipient",
      },
    ],
    // Generate more detailed route points for smoother animation
    routePoints: [
      [-74.006, 40.7128], // New York
      [-73.7781, 40.6413], // JFK
      [-70, 42], // Atlantic Ocean
      [-60, 45], // Atlantic Ocean
      [-45, 45], // North Atlantic
      [-30, 48], // North Atlantic
      [-15, 50], // North Atlantic
      [0, 50], // Europe
      [15, 50], // Europe
      [30, 48], // Europe
      [45, 46], // Europe/Asia
      [60, 45], // Central Asia
      [75, 43], // Central Asia
      [90, 42], // East Asia
      [105, 40], // East Asia
      [120, 40], // East Asia
      [135, 38], // Approaching Japan
      [139.7798, 35.5522], // Haneda Airport
      [139.6917, 35.6895], // Tokyo
    ],
    trackingEvents: [
      {
        date: "2024-04-10",
        time: "09:00 EDT",
        status: "Package picked up",
        location: "New York, USA",
      },
      {
        date: "2024-04-10",
        time: "11:45 EDT",
        status: "In transit to airport",
        location: "Queens, NY, USA",
      },
      {
        date: "2024-04-10",
        time: "14:30 EDT",
        status: "Departed from JFK Airport",
        location: "New York, USA",
      },
      {
        date: "2024-04-11",
        time: "02:00 UTC",
        status: "In transit over North Atlantic",
        location: "North Atlantic Ocean (airspace)",
      },
      {
        date: "2024-04-11",
        time: "06:00 UTC",
        status: "In transit over Europe",
        location: "Europe (airspace)",
      },
      {
        date: "2024-04-11",
        time: "10:00 UTC",
        status: "In transit over Central Asia",
        location: "Central Asia (airspace)",
      },
      {
        date: "2024-04-11",
        time: "14:00 UTC",
        status: "Approaching Japan",
        location: "East Asia (airspace)",
      },
      {
        date: "2024-04-12",
        time: "08:45 JST",
        status: "Arrived at Haneda Airport",
        location: "Tokyo, Japan",
      },
      {
        date: "2024-04-12",
        time: "09:30 JST",
        status: "Customs clearance completed",
        location: "Tokyo, Japan",
      },
      {
        date: "2024-04-12",
        time: "10:15 JST",
        status: "Out for delivery",
        location: "Tokyo, Japan",
      },
      {
        date: "2024-04-12",
        time: "11:30 JST",
        status: "Delivered",
        location: "Tokyo, Japan",
      },
    ],
    shipmentDetails: {
      carrier: "Global Express",
      weight: "5.2 kg",
      dimensions: "45 × 35 × 20 cm",
      service: "International Priority",
      estimatedDelivery: "April 12, 2024",
    },
  },
  // Add more sample shipments if needed
}

const ShipmentMap = () => {
  const [shipmentId, setShipmentId] = useState<string>("SP56789012")
  const [isTracking, setIsTracking] = useState<boolean>(false)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const [vehicleMarker, setVehicleMarker] = useState<maptilersdk.Marker | null>(null)
  const [progressPercentage, setProgressPercentage] = useState<number>(0)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [searchComplete, setSearchComplete] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(1) // Animation speed multiplier

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const markersRef = useRef<maptilersdk.Marker[]>([])
  const animationRef = useRef<number | null>(null)

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    maptilersdk.config.apiKey = "WPOrYvLmOvXmyuTyNP5h"
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: isDarkMode ? "dark-v2" : maptilersdk.MapStyle.STREETS,
      center: [-170, 35],
      zoom: 2,
    })

    // Add map controls
    map.current.addControl(new maptilersdk.NavigationControl(), "top-right")

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      // Clean up vehicle marker
      if (vehicleMarker) {
        vehicleMarker.remove()
      }

      // Clean up animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Clean up map
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isDarkMode, vehicleMarker])

  // Update map style when dark mode changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDarkMode ? "dark-v2" : maptilersdk.MapStyle.STREETS)
    }
  }, [isDarkMode])

  /**
   * Creates a vehicle marker with the appropriate icon and rotation
   */
  const createVehicleMarker = (
    type: RouteStep["vehicle"],
    coordinates: [number, number],
    rotation = 0,
  ): maptilersdk.Marker | null => {
    if (!map.current) return null

    const el = document.createElement("div")
    el.className = "vehicle-marker"

    // Use appropriate vehicle icon based on type
    let iconSvg = ""
    let iconColor = ""

    switch (type) {
      case "plane":
        // Plane icon with rotation transform
        iconSvg = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="transform: rotate(${rotation}deg)"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>`
        iconColor = "#3b82f6" // Brighter blue
        break
      case "ship":
        iconSvg = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="transform: rotate(${rotation}deg)"><path d="M2 20a6 6 0 0 0 12 0c0-7-12-7-12 0Z"></path><path d="M12 14h.01"></path><path d="M19 17h.01"></path><path d="M8 8h.01"></path><path d="M18 11h.01"></path><path d="M2 2h.01"></path><path d="M22 20a6 6 0 0 0-12 0c0-7 12-7 12 0Z"></path></svg>`
        iconColor = "#0ea5e9" // Bright cyan
        break
      case "truck":
      default:
        iconSvg = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="transform: rotate(${rotation}deg)"><path d="M10 17h4V5H2v12h3"></path><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path><path d="M14 17h1"></path><circle cx="7.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>`
        iconColor = "#10b981" // Bright emerald
    }

    el.innerHTML = iconSvg
    el.style.color = iconColor

    // Add a pulsing effect for the current vehicle
    el.classList.add("vehicle-pulse")

    return new maptilersdk.Marker({
      element: el,
      anchor: "center",
    }).setLngLat(coordinates)
  }

  /**
   * Calculate bearing/rotation between two points
   */
  const calculateBearing = (start: [number, number], end: [number, number]): number => {
    const startLat = (start[1] * Math.PI) / 180
    const startLng = (start[0] * Math.PI) / 180
    const endLat = (end[1] * Math.PI) / 180
    const endLng = (end[0] * Math.PI) / 180

    const y = Math.sin(endLng - startLng) * Math.cos(endLat)
    const x =
      Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng)

    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    bearing = (bearing + 360) % 360 // Normalize to 0-360

    return bearing
  }

  /**
   * Adds the route line and markers to the map
   */
  const addRouteToMap = (routeSteps: RouteStep[], routePoints?: [number, number][]): void => {
    if (!map.current || !routeSteps || routeSteps.length === 0) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Use detailed route points if available, otherwise use step coordinates
    const coordinates = routePoints || routeSteps.map((step) => step.coordinates)

    // Add route line
    if (map.current.getSource("route")) {
      const routeSource = map.current.getSource("route") as unknown as maptilersdk.GeoJSONSource
      routeSource.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
      })
    } else {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      })

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": isDarkMode ? "#60a5fa" : "#3b82f6", // Blue
          "line-width": 4,
          "line-dasharray": [0.5, 1.5],
          "line-opacity": 0.7,
        },
      })

      // Add completed route layer
      map.current.addSource("completed-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [coordinates[0]],
          },
        },
      })

      map.current.addLayer({
        id: "completed-route",
        type: "line",
        source: "completed-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": isDarkMode ? "#4ade80" : "#16a34a", // Green
          "line-width": 4,
          "line-opacity": 0.9,
        },
      })

      // Add glow effect to the route
      map.current.addLayer(
        {
          id: "route-glow",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": isDarkMode ? "#93c5fd" : "#60a5fa", // Lighter blue
            "line-width": 8,
            "line-opacity": 0.15,
            "line-blur": 3,
          },
        },
        "route",
      )
    }

    // Add markers for all route steps (not all route points)
    routeSteps.forEach((step, index) => {
      // Create marker element
      const el = document.createElement("div")
      el.className = "location-marker"

      // Different styling for different stages
      const markerColor = index <= currentStepIndex ? "#16a34a" : "#94a3b8"

      el.innerHTML = `
        <div class="w-4 h-4 bg-white rounded-full border-2 flex items-center justify-center shadow-md" 
             style="border-color: ${markerColor}">
          <div class="w-2 h-2 rounded-full" style="background-color: ${markerColor}"></div>
        </div>
      `

      // Add tooltip with location info
      const popup = new maptilersdk.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        className: isDarkMode ? "dark-popup" : "",
      }).setHTML(`
        <div class="p-2 ${isDarkMode ? "bg-gray-800 text-white" : ""}">
          <div class="font-bold">${step.title}</div>
          <div>${step.location}</div>
          <div class="text-xs opacity-75">${step.time}</div>
        </div>
      `)

      // Create and add the marker
      const marker = new maptilersdk.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(step.coordinates)
        .setPopup(popup)
        .addTo(map.current!)

      markersRef.current.push(marker)
    })
  }

  /**
   * Updates the completed portion of the route
   */
  const updateCompletedRoute = (coordinates: [number, number][], currentIndex: number): void => {
    if (!map.current || coordinates.length === 0) return

    // Get coordinates up to the current point
    const completedCoordinates = coordinates.slice(0, currentIndex + 1)

    // Update completed route
    const source = map.current.getSource("completed-route") as maptilersdk.GeoJSONSource;
    if (source && "setData" in source) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: completedCoordinates,
        },
      })
    }
  }

  /**
   * Animate vehicle along route points
   */
  const animateVehicleAlongRoute = (
    routePoints: [number, number][],
    vehicleType: RouteStep["vehicle"],
    startIndex = 0,
  ) => {
    if (!map.current || routePoints.length < 2) return

    let currentIndex = startIndex

    // Calculate the total route length for progress percentage
    const totalPoints = routePoints.length - 1

    // Create initial vehicle marker
    const initialPoint = routePoints[currentIndex]
    const nextPoint = routePoints[currentIndex + 1]
    const initialBearing = calculateBearing(initialPoint, nextPoint)

    const vehicle = createVehicleMarker(vehicleType, initialPoint, initialBearing)

    if (vehicle && map.current) {
      vehicle.addTo(map.current)
      setVehicleMarker(vehicle)
    }

    // Update completed route
    updateCompletedRoute(routePoints, currentIndex)

    // Animation function
    const animate = () => {
      // If we've reached the end of the route
      if (currentIndex >= routePoints.length - 1) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        return
      }

      // Get current and next points
      const currentPoint = routePoints[currentIndex]
      const nextPoint = routePoints[currentIndex + 1]

      // Calculate bearing for rotation
      const bearing = calculateBearing(currentPoint, nextPoint)

      // Update vehicle position and rotation
      if (vehicleMarker) {
        vehicleMarker.remove()
      }

      const newVehicle = createVehicleMarker(vehicleType, nextPoint, bearing)

      if (newVehicle && map.current) {
        newVehicle.addTo(map.current)
        setVehicleMarker(newVehicle)
      }

      // Update current index
      currentIndex++
      // Update progress percentage
      const progress = (currentIndex / totalPoints) * 100
      setProgressPercentage(progress)

      // Update completed route
      updateCompletedRoute(routePoints, currentIndex)

      // Determine which route step we're on based on the current route point
      const stepIndex = determineCurrentStepIndex(routePoints, currentIndex, shipmentData?.routeSteps || [])
      if (stepIndex !== currentStepIndex) {
        setCurrentStepIndex(stepIndex)
      }

      // Fly to current location with smooth animation
      if (map.current && currentIndex % 3 === 0) {
        // Only update camera every few points for smoother animation
        map.current.flyTo({
          center: nextPoint,
          zoom: 3,
          duration: 2000,
          essential: true, // This animation is considered essential for the map experience
        })
      }

      // Schedule next frame based on animation speed
      const delay = 300 / animationSpeed // Adjust base delay for speed
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, delay)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)
  }

  /**
   * Determine which route step we're on based on the current route point
   */
  const determineCurrentStepIndex = (
    routePoints: [number, number][],
    currentPointIndex: number,
    routeSteps: RouteStep[],
  ): number => {
    if (routeSteps.length === 0) return 0

    // If we're at the end, return the last step
    if (currentPointIndex >= routePoints.length - 1) {
      return routeSteps.length - 1
    }

    // Find the closest step to the current point
    const currentPoint = routePoints[currentPointIndex]

    // Map route steps to their coordinates
    const stepCoordinates = routeSteps.map((step) => step.coordinates)

    // Find the last step that we've passed
    for (let i = stepCoordinates.length - 1; i >= 0; i--) {
      const stepCoord = stepCoordinates[i]

      // Simple check: if we've passed the longitude of this step
      if (currentPoint[0] >= stepCoord[0]) {
        return i
      }
    }

    return 0
  }

  // Animation effect for tracking the shipment
  useEffect(() => {
    if (!isTracking || !shipmentData) return

    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Initial setup
    const routePoints = shipmentData.routePoints || shipmentData.routeSteps.map((step) => step.coordinates)
    addRouteToMap(shipmentData.routeSteps, routePoints)

    // Reset state
    setCurrentStepIndex(0)
    setProgressPercentage(0)

    // Start animation with a slight delay to allow map to initialize
    setTimeout(() => {
      animateVehicleAlongRoute(routePoints, shipmentData.routeSteps[0].vehicle)
    }, 1000)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isTracking, shipmentData, animationSpeed])

  /**
   * Handles the tracking form submission
   */
  const handleTrackShipment = (): void => {
    setIsSearching(true)
    setSearchComplete(false)

    // Simulate a search delay for better UX
    setTimeout(() => {
      // Fetch shipment data based on ID (using mock data here)
      const data = SAMPLE_SHIPMENTS[shipmentId]
      if (!data) {
        setIsSearching(false)
        alert("Shipment not found. Try using SP56789012 as sample ID.")
        return
      }

      setSearchComplete(true)

      // Short delay before starting the tracking
      setTimeout(() => {
        setIsSearching(false)
        setSearchComplete(false)
        setShipmentData(data)
        setIsTracking(true)

        if (map.current) {
          // Fit bounds to see the entire route
          const bounds = new maptilersdk.LngLatBounds()
          const routePoints = data.routePoints || data.routeSteps.map((step) => step.coordinates)

          routePoints.forEach((point) => {
            bounds.extend(point)
          })

          map.current.fitBounds(bounds, {
            padding: 50,
            duration: 2000,
          })

          // Then zoom to starting point
          setTimeout(() => {
            if (map.current) {
              map.current.flyTo({
                center: routePoints[0],
                zoom: 5,
                duration: 1500,
              })
            }
          }, 2500)
        }
      }, 1000)
    }, 1500)
  }

  /**
   * Returns the appropriate icon component based on vehicle type
   */
  const getVehicleIcon = (type: RouteStep["vehicle"]) => {
    switch (type) {
      case "plane":
        return <Plane className="text-blue-600" />
      case "ship":
        return <Ship className="text-cyan-600" />
      case "truck":
        return <Truck className="text-emerald-600" />
      default:
        return <Package />
    }
  }

  /**
   * Formats a date string for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="grid lg:grid-cols-2 gap-8 p-4 dark:bg-gray-900">
        <Card className="p-6 bg-white shadow-lg border rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Global Shipment Tracker
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="dark:text-white dark:border-gray-600"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleTrackShipment()
            }}
            className="mb-6"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="shipmentId" className="text-lg font-bold mb-2 block dark:text-gray-200">
                  Track Your Shipment
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id="shipmentId"
                      value={shipmentId}
                      onChange={(e) => setShipmentId(e.target.value)}
                      placeholder="Enter your shipment ID"
                      className="text-lg p-5 border-2 rounded-lg flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg p-5 rounded-lg min-w-32 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : searchComplete ? (
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                    ) : (
                      <Package className="mr-2 h-5 w-5" />
                    )}
                    {isSearching ? "Searching..." : searchComplete ? "Found" : "Track"}
                  </Button>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 dark:text-gray-400 text-sm mt-2"
                >
                  Try using sample ID: SP56789012
                </motion.p>
              </div>
            </div>
          </form>

          {isTracking && shipmentData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Shipment header with progress bar */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-5 dark:from-blue-900/30 dark:to-cyan-900/30 dark:border-blue-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300">Shipment Details</h3>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                  >
                    {shipmentData.routeSteps[currentStepIndex].title}
                  </Badge>
                </div>

                {/* Origin/Destination */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-full inline-flex mb-1 shadow-sm">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Origin</div>
                    <div className="text-sm font-semibold dark:text-gray-200">{shipmentData.origin}</div>
                  </div>

                  <div className="flex-1">
                    <div className="h-1 bg-blue-200 dark:bg-blue-800 rounded-full relative">
                      <motion.div
                        className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500 absolute top-0 left-0 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-center mt-1">
                      <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-full inline-flex mb-1 shadow-sm">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Destination</div>
                    <div className="text-sm font-semibold dark:text-gray-200">{shipmentData.destination}</div>
                  </div>
                </div>

                {/* ETA and other details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Shipment ID</p>
                    <p className="font-semibold dark:text-gray-200">{shipmentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">ETA</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                      <span className="dark:text-gray-200">{shipmentData.shipmentDetails.estimatedDelivery}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Carrier</p>
                    <p className="font-semibold dark:text-gray-200">{shipmentData.shipmentDetails.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Service</p>
                    <p className="font-semibold dark:text-gray-200">{shipmentData.shipmentDetails.service}</p>
                  </div>
                </div>
              </div>

              {/* Animation Speed Control */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium dark:text-gray-300">Animation Speed</div>
                <div className="flex space-x-2">
                  {[0.5, 1, 2, 5].map((speed) => (
                    <Button
                      key={speed}
                      size="sm"
                      variant={animationSpeed === speed ? "default" : "outline"}
                      onClick={() => setAnimationSpeed(speed)}
                      className={`${
                        animationSpeed === speed
                          ? "bg-blue-600 text-white"
                          : "text-blue-600 dark:text-blue-400 dark:border-gray-600"
                      }`}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="timeline" className="dark:data-[state=active]:bg-blue-800">
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="details" className="dark:data-[state=active]:bg-blue-800">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="history" className="dark:data-[state=active]:bg-blue-800">
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="pt-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 max-h-80 overflow-y-auto pr-2"
                    >
                      {shipmentData.routeSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            index === currentStepIndex
                              ? "bg-blue-50 border border-blue-100 shadow-sm dark:bg-blue-900/30 dark:border-blue-800"
                              : index < currentStepIndex
                                ? "opacity-75"
                                : "opacity-50"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                              index <= currentStepIndex
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            {getVehicleIcon(step.vehicle)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium dark:text-gray-200">{step.title}</p>
                              <Badge
                                variant="outline"
                                className={
                                  index < currentStepIndex
                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                    : index === currentStepIndex
                                      ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                      : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                }
                              >
                                {index < currentStepIndex
                                  ? "Completed"
                                  : index === currentStepIndex
                                    ? "Current"
                                    : "Pending"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.location}</p>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>{step.time}</span>
                              <button
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                onClick={() => {
                                  if (map.current) {
                                    map.current.flyTo({
                                      center: step.coordinates,
                                      zoom: 5,
                                      duration: 1500,
                                    })
                                  }
                                }}
                              >
                                <Info className="h-3 w-3 mr-1" />
                                View on map
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="details" className="pt-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Package Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium dark:text-gray-200">{shipmentData.shipmentDetails.weight}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dimensions</p>
                            <p className="font-medium dark:text-gray-200">{shipmentData.shipmentDetails.dimensions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Service Type</p>
                            <p className="font-medium dark:text-gray-200">{shipmentData.shipmentDetails.service}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Carrier</p>
                            <p className="font-medium dark:text-gray-200">{shipmentData.shipmentDetails.carrier}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Shipment Route</h4>
                        <div className="flex items-center space-x-2 mb-4">
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium dark:text-gray-200">{shipmentData.origin}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium dark:text-gray-200">{shipmentData.destination}</span>
                        </div>
                        <div className="space-y-3">
                          {shipmentData.routeSteps.map((step, index) => (
                            <div key={index} className="flex space-x-3 items-center">
                              <div className="min-w-8">{getVehicleIcon(step.vehicle)}</div>
                              <div>
                                <div className="text-sm font-medium dark:text-gray-200">
                                  {step.title} at {step.location}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{step.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="history" className="pt-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="history"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 max-h-80 overflow-y-auto pr-2"
                    >
                      {shipmentData.trackingEvents.map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 pb-4 relative"
                        >
                          <div className="absolute w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full -left-1.5 top-1"></div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium dark:text-gray-200">{event.status}</span>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{event.location}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{event.time}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden h-[700px] bg-white shadow-lg border rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <style jsx global>{`
            .vehicle-marker {
              background: none;
            }
            .vehicle-marker svg {
              filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
              transition: transform 0.3s ease;
            }
            .vehicle-pulse {
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.8;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            .location-marker {
              width: 16px;
              height: 16px;
              cursor: pointer;
              transition: transform 0.2s ease;
            }
            .location-marker:hover {
              transform: scale(1.2);
            }
            .maplibregl-popup {
              max-width: 200px;
              font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
              border-radius: 8px;
              overflow: hidden;
            }
            .dark-popup .maplibregl-popup-content {
              background-color: #1f2937;
              color: white;
            }
            .dark-popup .maplibregl-popup-tip {
              border-top-color: #1f2937;
            }
          `}</style>
          <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
        </Card>

        {isInfoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 dark:text-white">Shipment Information</h3>
              <p className="mb-4 dark:text-gray-300">
                This is a demo of a shipment tracking application. Try using the sample tracking ID: SP56789012
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setIsInfoModalOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ShipmentMap

