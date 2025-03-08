import React from 'react';
import { Clock, DollarSign, AlertTriangle, Package, CloudRainWind, Shield, LightbulbIcon } from 'lucide-react';
import type { Route } from '../types';

interface RouteDetailsProps {
  route: Route;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route }) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-[#1E3A5F] rounded-lg p-6 border ">
      <h2 className="text-xl font-semibold mb-4">Route Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#2A4A73] p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-sm text-gray-400">Transit Time</span>
          </div>
          <p className="text-2xl font-bold">{route.duration}h</p>
        </div>
        
        <div className="bg-[#2A4A73]  p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-sm text-gray-400">Total Cost</span>
          </div>
          <p className="text-2xl font-bold">${route.cost}</p>
        </div>
        
        <div className="bg-[#2A4A73]  p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Package className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-sm text-gray-400">Cargo Type</span>
          </div>
          <p className="text-2xl font-bold">{route.cargoType}</p>
        </div>
        
        <div className="bg-[#2A4A73]  p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-400">Risk Level</span>
          </div>
          <p className={`text-2xl font-bold ${getRiskColor(route.riskLevel)}`}>
            {route.riskLevel}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6 bg-[#2A4A73]  p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <LightbulbIcon className="w-5 h-5 text-yellow-400 mr-2" />
          <h3 className="font-semibold">Recommendations</h3>
        </div>
        <ul className="space-y-2">
          {route.recommendations.map((rec, index) => (
            <li key={index} className="flex items-center text-sm text-gray-300">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Alerts */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#2A4A73]  p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CloudRainWind className="w-5 h-5 text-blue-400 mr-2" />
            <h4 className="font-medium">Weather</h4>
          </div>
          <p className="text-sm text-gray-300">{route.alerts.weather}</p>
        </div>
        <div className="bg-[#2A4A73]  p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            <h4 className="font-medium">Political</h4>
          </div>
          <p className="text-sm text-gray-300">{route.alerts.political}</p>
        </div>
        <div className="bg-[#2A4A73]  p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <h4 className="font-medium">Security</h4>
          </div>
          <p className="text-sm text-gray-300">{route.alerts.security}</p>
        </div>
      </div>

      {/* Route Segments */}
      <div className="space-y-4">
        {route.segments.map((segment, index) => (
          <div key={index} className="bg-[#2A4A73]  p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Segment {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Mode</p>
                <p className="font-medium">{segment.mode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="font-medium">{segment.duration}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Distance</p>
                <p className="font-medium">{segment.distance}km</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Cost</p>
                <p className="font-medium">${segment.cost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteDetails;