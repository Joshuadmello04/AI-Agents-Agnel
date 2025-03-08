import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Flag, AlertCircle, Package, List } from 'lucide-react';
import { findPaths } from '../services/api'; // Import the API service

interface ShipmentFormProps {
  onResponse: (response: any) => void; // Callback to handle the API response
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ onResponse }) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    start: '',
    goal: '',
    avoid_countries: [] as string[],
    top_n: 3,
    time_weight: 0.5,
    price_weight: 0.5,
    allowed_modes: ['land', 'sea', 'air'],
    prohibited_flag: 'avoid',
    restricted_flag: 'avoid',
    description: '',
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send the form data to the backend
      const response = await findPaths(formData);
      console.log('API Response:', response); // Log the response to the console
      onResponse(response); // Pass the response to the parent component
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  // Handle changes in allowed modes (land, sea, air)
  const handleModeChange = (mode: string) => {
    setFormData((prev) => {
      const newModes = prev.allowed_modes.includes(mode)
        ? prev.allowed_modes.filter((m) => m !== mode) // Remove mode if already selected
        : [...prev.allowed_modes, mode]; // Add mode if not selected
      return { ...prev, allowed_modes: newModes };
    });
  };

  return (
    <div className="bg-[#1E3A5F] rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Location */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Start Location
          </label>
          <input
            type="text"
            value={formData.start}
            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="Enter start location"
            required
          />
        </div>

        {/* Goal Location */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Goal Location
          </label>
          <input
            type="text"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="Enter goal location"
            required
          />
        </div>

        {/* Avoid Countries */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Flag className="w-4 h-4 mr-2" />
            Avoid Countries (comma-separated)
          </label>
          <input
            type="text"
            value={formData.avoid_countries.join(',')}
            onChange={(e) =>
              setFormData({
                ...formData,
                avoid_countries: e.target.value.split(',').map((s) => s.trim()),
              })
            }
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="e.g., TH, CN, IN"
          />
        </div>

        {/* Top N Routes */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <List className="w-4 h-4 mr-2" />
            Top N Routes
          </label>
          <input
            type="number"
            value={formData.top_n}
            onChange={(e) => setFormData({ ...formData, top_n: parseInt(e.target.value, 10) })}
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            min="1"
            required
          />
        </div>

        {/* Time vs Cost Priority */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            Time vs Cost Priority
          </label>
          <div className="flex items-center space-x-4">
            <span>Time</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.time_weight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  time_weight: parseFloat(e.target.value),
                  price_weight: 1 - parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
            <span>Cost</span>
          </div>
        </div>

        {/* Allowed Modes */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            Allowed Transportation Modes
          </label>
          <div className="flex space-x-4">
            {['land', 'sea', 'air'].map((mode) => (
              <label key={mode} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowed_modes.includes(mode)}
                  onChange={() => handleModeChange(mode)}
                  className="mr-2"
                />
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Prohibited Flag */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            Prohibited Flag
          </label>
          <select
            value={formData.prohibited_flag}
            onChange={(e) => setFormData({ ...formData, prohibited_flag: e.target.value })}
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="avoid">Avoid</option>
            <option value="allow">Allow</option>
          </select>
        </div>

        {/* Restricted Flag */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            Restricted Flag
          </label>
          <select
            value={formData.restricted_flag}
            onChange={(e) => setFormData({ ...formData, restricted_flag: e.target.value })}
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="avoid">Avoid</option>
            <option value="allow">Allow</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Package className="w-4 h-4 mr-2" />
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#2A4A73] border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="Enter cargo description"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Calculate Routes
        </button>
      </form>
    </div>
  );
};

export default ShipmentForm;