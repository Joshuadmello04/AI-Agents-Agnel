import React, { useState } from 'react';
import { Package, MapPin, Weight, Calendar } from 'lucide-react';
import type { ShipmentDetails } from '../types';

interface ShipmentFormProps {
  onSubmit: (details: ShipmentDetails) => void;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoType: 'general',
    weight: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ShipmentDetails);
  };

  return (
    <div className="bg-[#1E3A5F] rounded-lg p-6 border ">
      <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Origin
          </label>
          <input
            type="text"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            className="w-full bg-[#2A4A73]  border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="Enter origin city"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Destination
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="w-full bg-[#2A4A73]  border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="Enter destination city"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Package className="w-4 h-4 mr-2" />
            Cargo Type
          </label>
          <select
            value={formData.cargoType}
            onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
            className="w-full bg-[#2A4A73]  border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="general">General Cargo</option>
            <option value="perishable">Perishable</option>
            <option value="hazardous">Hazardous</option>
            <option value="fragile">Fragile</option>
          </select>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Weight className="w-4 h-4 mr-2" />
            Weight (kg)
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full bg-[#2A4A73]  border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="Enter cargo weight"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Delivery Deadline
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full bg-[#2A4A73]  border border-blue-600 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Calculate Routes
        </button>
      </form>
    </div>
  );
}

export default ShipmentForm;