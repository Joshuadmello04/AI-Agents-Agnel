// app/routes/page.tsx
'use client';

import React, { useState } from 'react';
import { Plane, Ship, Truck, Clock, DollarSign, Package, MapPin } from 'lucide-react';
import RouteMap from '@/components/RouteMap';
import RouteDetails from '@/components/RouteDetails';
import ShipmentForm from '@/components/ShipmentForm';
import { calculateRoutes } from '@/utils/routeCalculator';
import type { Route, ShipmentDetails } from '@/types';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const handleShipmentSubmit = (shipmentDetails: ShipmentDetails) => {
    const calculatedRoutes = calculateRoutes(shipmentDetails);
    setRoutes(calculatedRoutes);
    setSelectedRoute(calculatedRoutes[0]);
  };

  return (
    <div className="min-h-screen bg-[#112240] text-gray-100">
      <nav className="bg-[#0A192F] border-blue-100 p-4">
        <div className="container mx-auto flex items-center">
          <Package className="w-8 h-8 text-blue-400 mr-3" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            LogisticsPro Route Optimizer
          </h1>
        </div>
      </nav>

      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <ShipmentForm onSubmit={handleShipmentSubmit} />
          
          {routes.length > 0 && (
            <div className="bg-[#1E3A5F] rounded-lg p-4 border ">
              <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
              <div className="space-y-3">
                {routes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRoute(route)}
                    className={`w-full p-3 rounded-lg transition-all ${
                      selectedRoute === route
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#2A4A73]  hover:bg-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {route.modes.includes('air') && <Plane className="w-4 h-4" />}
                        {route.modes.includes('sea') && <Ship className="w-4 h-4" />}
                        {route.modes.includes('land') && <Truck className="w-4 h-4" />}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {route.duration}h
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {route.cost}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          <RouteMap selectedRoute={selectedRoute} />
          {selectedRoute && <RouteDetails route={selectedRoute} />}
        </div>
      </main>
    </div>
  );
}