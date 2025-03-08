import React, { useCallback, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon, LatLngBounds, LatLng, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Route } from '../types';

interface RouteMapProps {
  selectedRoute: Route | null;
}

// Fix for default marker icons in Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom control component to add 3D view toggle
const MapControls = () => {
  const map = useMap();
  const [is3DActive, setIs3DActive] = useState(false);
  
  const toggle3DMode = () => {
    const newState = !is3DActive;
    setIs3DActive(newState);
    
    // Change the map style to 3D or 2D based on the toggle
    const currentLayer = map.eachLayer((layer: any) => {
      if (layer instanceof TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    const mapStyle = newState 
      ? `https://api.maptiler.com/maps/3d-v2/{z}/{x}/{y}.png?key=${apiKey}`
      : `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`;
      
    new TileLayer(mapStyle, {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);
  };
  
  return (
    <div className="leaflet-bottom leaflet-right" style={{ zIndex: 1000, marginBottom: '20px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={toggle3DMode} 
          className="bg-blue-700 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          title={is3DActive ? "Switch to 2D view" : "Switch to 3D view"}
        >
          {is3DActive ? "2D" : "3D"}
        </button>
      </div>
    </div>
  );
};

// Component to handle map click navigation with MapTiler
const MapClickHandler = ({ selectedRoute }) => {
  const map = useMap();
  const [navigationPath, setNavigationPath] = useState<[number, number][]>([]);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  
  React.useEffect(() => {
    const handleMapClick = async (e: any) => {
      const { lat, lng } = e.latlng;
      setDestination([lat, lng]);
      
      if (selectedRoute && selectedRoute.segments.length > 0) {
        const startSegment = selectedRoute.segments[0];
        const startCoords = coordinates[startSegment.origin];
        
        if (startCoords) {
          try {
            // Using MapTiler's Directions API for routing
            const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
            const response = await fetch(
              `https://api.maptiler.com/directions/v1/driving/${startCoords[1]},${startCoords[0]};${lng},${lat}?key=${apiKey}`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.routes && data.routes.length > 0) {
                // Extract coordinates from the route
                const routeCoordinates = data.routes[0].geometry.coordinates.map(
                  (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
                );
                
                setNavigationPath(routeCoordinates);
                
                // Add the navigation polyline to the map
                if (map) {
                  // Remove previous navigation polylines
                  map.eachLayer((layer: any) => {
                    if (layer.options && layer.options.className === 'navigation-route') {
                      map.removeLayer(layer);
                    }
                  });
                  
                  // Add new navigation polyline
                  new Polyline(routeCoordinates, {
                    color: '#3388ff',
                    weight: 5,
                    opacity: 0.7,
                    dashArray: '10, 10',
                    className: 'navigation-route'
                  }).addTo(map);
                  
                  // Add destination marker
                  new Marker([lat, lng], {
                    icon: new Icon({
                      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })
                  }).addTo(map).bindPopup('Destination').openPopup();
                }
              }
            }
          } catch (error) {
            console.error('Error fetching directions:', error);
          }
        }
      }
    };

    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, selectedRoute]);
  
  return null;
};

// Shared coordinates object
const coordinates: Record<string, [number, number]> = {
  'New York': [40.7128, -74.006],
  'London': [51.5074, -0.1276],
  'Tokyo': [35.6895, 139.6917],
  'Singapore': [1.3521, 103.8198],
  'Dubai': [25.2048, 55.2708],
  'Shanghai': [31.2304, 121.4737],
  'Shanghai Airport': [31.1443, 121.8083],
  'Tokyo Airport': [35.5494, 139.7798],
};

const RouteMap: React.FC<RouteMapProps> = ({ selectedRoute }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  
  if (!selectedRoute) {
    return (
      <div className="bg-blue-800 rounded-lg p-6 border border-blue-700 h-[400px] flex items-center justify-center">
        <p className="text-gray-400">Select shipment details to view routes</p>
      </div>
    );
  }

  const getRouteColor = (riskLevel: string): string => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return '#4ade80';
      case 'medium':
        return '#fbbf24';
      case 'high':
        return '#ef4444';
      default:
        return '#60a5fa';
    }
  };

  const getTransportIcon = (mode: string) => {
    const iconSize = 24;
    const iconUrl = mode === 'air' 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
      : mode === 'sea'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

    return new Icon({
      iconUrl,
      iconSize: [iconSize, iconSize * 1.5],
      iconAnchor: [iconSize / 2, iconSize * 1.5],
      popupAnchor: [0, -iconSize],
    });
  };

  // Create route points and bounds
  const bounds = new LatLngBounds([]);
  const routePoints: [number, number][] = [];
  const transportMarkers: { position: [number, number]; mode: string; info: string }[] = [];

  selectedRoute.segments.forEach((segment, index) => {
    const startCoords = coordinates[segment.origin];
    const endCoords = coordinates[segment.destination];

    if (startCoords && endCoords) {
      routePoints.push(startCoords);
      bounds.extend(startCoords);

      // Add transport mode marker at the midpoint
      const midLat = (startCoords[0] + endCoords[0]) / 2;
      const midLng = (startCoords[1] + endCoords[1]) / 2;
      transportMarkers.push({
        position: [midLat, midLng],
        mode: segment.mode,
        info: `${segment.mode.toUpperCase()} - ${segment.duration}h, ${segment.distance}km`,
      });

      if (index === selectedRoute.segments.length - 1) {
        routePoints.push(endCoords);
        bounds.extend(endCoords);
      }
    }
  });

  // Function to handle marker click and show navigation to that point
  const handleMarkerClick = async (position: [number, number]) => {
    if (mapRef.current && selectedRoute && selectedRoute.segments.length > 0) {
      const startSegment = selectedRoute.segments[0];
      const startCoords = coordinates[startSegment.origin];
      
      if (startCoords) {
        try {
          // Using MapTiler's Directions API for routing
          const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
          const response = await fetch(
            `https://api.maptiler.com/directions/v1/driving/${startCoords[1]},${startCoords[0]};${position[1]},${position[0]}?key=${apiKey}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
              // Extract coordinates from the route
              const routeCoordinates = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
              );
              
              // Remove previous navigation polylines
              mapRef.current.eachLayer((layer: any) => {
                if (layer.options && layer.options.className === 'navigation-route') {
                  mapRef.current.removeLayer(layer);
                }
              });
              
              // Add new navigation polyline
              new Polyline(routeCoordinates, {
                color: '#3388ff',
                weight: 5,
                opacity: 0.7,
                dashArray: '10, 10',
                className: 'navigation-route'
              }).addTo(mapRef.current);
            }
          }
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
    }
  };

  return (
    <div className="bg-[#1E3A5F] rounded-md p-2 border ">
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          bounds={bounds}
          className="h-full w-full rounded-lg"
          zoomControl={false}
          style={{ background: '#0A192F' }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          {/* MapTiler Map */}
          <TileLayer
            url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          />
          
          {/* Add zoom control */}
          <ZoomControl position="bottomleft" />
          
          {/* Shipment route */}
          <Polyline
            positions={routePoints}
            color={getRouteColor(selectedRoute.riskLevel)}
            weight={3}
            opacity={0.8}
          />

          {transportMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={getTransportIcon(marker.mode)}
              eventHandlers={{
                click: () => {
                  handleMarkerClick(marker.position);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="text-blue-900 p-2">
                  <p className="font-semibold">{marker.info}</p>
                  <button 
                    className="mt-2 text-blue-600 text-sm underline"
                    onClick={() => handleMarkerClick(marker.position)}
                  >
                    Show route here
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Add map click handler for navigation */}
          <MapClickHandler selectedRoute={selectedRoute} />
          
          {/* Add 3D toggle control */}
          <MapControls />
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;