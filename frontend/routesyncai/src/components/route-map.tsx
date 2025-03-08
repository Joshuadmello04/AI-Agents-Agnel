"use client"

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { RoutePath } from '@/lib/types'

interface RouteMapProps {
  route: RoutePath
}

export function RouteMap({ route }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [is3DView, setIs3DView] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!mapContainer.current) return

    if (!isFullscreen) {
      if (mapContainer.current.requestFullscreen) {
        mapContainer.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, []);

  // Toggle 3D view
  const toggle3DView = () => {
    if (!map.current) return
    
    setIs3DView(!is3DView);
    
    if (!is3DView) {
      // Adjust pitch and bearing for 3D-like view
      map.current.setPitch(60);
      map.current.setBearing(30);
    } else {
      // Reset pitch and bearing
      map.current.setPitch(0);
      map.current.setBearing(0);
    }
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map with Maptiler style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets/style.json?key=KjP8QVbU8JTtyyew1cAd",
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
      interactive: true,
      pitch: 0, // Start with 2D view
      bearing: 0
    })

    // Add controls with specific positioning
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left')
    
    // Wait for map to load before adding data
    map.current.on('load', () => {
      renderRouteOnMap();
    });

    const renderRouteOnMap = () => {
      if (!map.current) return;
      
      const coordinates: [number, number][] = [];
      const markers: maplibregl.Marker[] = [];

      // Create custom markers with animation
      const createMarker = (color: string, type: 'start' | 'intermediate' | 'end') => {
        const el = document.createElement('div');
        el.className = 'relative';
        
        const inner = document.createElement('div');
        inner.className = `w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
          type === 'start' ? 'bg-emerald-500' :
          type === 'end' ? 'bg-red-500' :
          'bg-blue-500'
        }`;
        
        if (type === 'start' || type === 'end') {
          const pulse = document.createElement('div');
          pulse.className = 'absolute -inset-2 rounded-full bg-current animate-ping opacity-20';
          pulse.style.backgroundColor = color;
          el.appendChild(pulse);
        }
        
        el.appendChild(inner);
        return el;
      };

      // Process all route edges to extract coordinates
      if (route && route.edges && route.edges.length > 0) {
        // Add markers and collect coordinates for each edge
        route.edges.forEach((edge, index) => {
          if (!edge.from || !edge.to) return;
          
          const [fromLat, fromLng] = edge.from.split(',').map(Number);
          const [toLat, toLng] = edge.to.split(',').map(Number);
          
          // Validate coordinates
          if (isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) return;
          
          // Add starting point coordinate and marker
          if (index === 0) {
            coordinates.push([fromLng, fromLat]);
            
            const startMarker = new maplibregl.Marker({
              element: createMarker('#10b981', 'start'),
              anchor: 'center'
            })
              .setLngLat([fromLng, fromLat])
              .setPopup(new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                className: 'custom-popup'
              }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold mb-1">${edge.from}</h3>
                  <p class="text-sm text-emerald-500 font-medium">Starting Point</p>
                </div>
              `))
              .addTo(map.current!);
            
            markers.push(startMarker);
          }
          
          // Add intermediate waypoint markers
          if (index > 0) {
            coordinates.push([fromLng, fromLat]);
            
            const waypointMarker = new maplibregl.Marker({
              element: createMarker('#3b82f6', 'intermediate'),
              anchor: 'center'
            })
              .setLngLat([fromLng, fromLat])
              .setPopup(new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                className: 'custom-popup'
              }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold mb-1">${edge.from}</h3>
                  <p class="text-sm opacity-70">${edge.mode || 'Unknown'} transport</p>
                </div>
              `))
              .addTo(map.current!);
            
            markers.push(waypointMarker);
          }
          
          // Always add destination coordinate and marker
          coordinates.push([toLng, toLat]);
          
          // If this is the final edge, add end marker
          if (index === route.edges.length - 1) {
            const endMarker = new maplibregl.Marker({
              element: createMarker('#ef4444', 'end'),
              anchor: 'center'
            })
              .setLngLat([toLng, toLat])
              .setPopup(new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                className: 'custom-popup'
              }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold mb-1">${edge.to}</h3>
                  <p class="text-sm text-red-500 font-medium">Final Destination</p>
                </div>
              `))
              .addTo(map.current!);
            
            markers.push(endMarker);
          }
          
          // Add direct route line for this segment
          const sourceId = `route-${index}`;
          const lineId = `line-${index}`;
          
          // Check if source already exists
          if (!map.current!.getSource(sourceId)) {
            map.current!.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [[fromLng, fromLat], [toLng, toLat]]
                }
              }
            });
            
            // Add line layer with style based on transport mode
            map.current!.addLayer({
              id: lineId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': getTransportColor(edge.mode),
                'line-width': 4,
                'line-dasharray': edge.mode === 'air' ? [2, 1] : [1],
                'line-opacity': 0.8
              }
            });
          }
        });
      }

      // Fit map to show all coordinates
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce((bound, coord) => {
          return bound.extend(coord as maplibregl.LngLatLike);
        }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
        
        map.current!.fitBounds(bounds, {
          padding: 100,
          duration: 1000
        });
      }
    };

    // Helper function to get color based on transport mode
    function getTransportColor(mode?: string) {
      switch (mode?.toLowerCase()) {
        case 'air': return '#60a5fa'; // blue
        case 'sea': return '#22d3ee'; // cyan
        case 'rail': return '#8b5cf6'; // purple
        case 'road': return '#f59e0b'; // amber
        default: return '#64748b'; // slate (default)
      }
    }

    return () => {
      map.current?.remove();
    };
  }, [route]);

  // Helper function to format duration in hours and minutes
  function formatDuration(minutes?: number): string {
    if (!minutes) return 'Unknown';
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${isFullscreen ? 'h-screen w-screen' : 'h-full w-full'}`}>
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>End</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-400" />
            <span>Air</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-cyan-400" />
            <span>Sea</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-purple-400" />
            <span>Rail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-amber-500" />
            <span>Road</span>
          </div>
        </div>
      </div>
      
      {/* Controls - positioned away from the navigation control */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={toggle3DView}
          className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-100 transition-colors"
          title={is3DView ? "Switch to 2D view" : "Switch to 3D view"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={is3DView ? "M2 6h20M2 12h20M2 18h20" : "M4 7l16-4M4 12l16-4M4 17l16-4"} />
          </svg>
        </button>
        
        <button 
          onClick={toggleFullscreen}
          className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-100 transition-colors mt-2"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
              isFullscreen 
                ? "M9 9l-6 6m0 0l6 6m-6-6h18" 
                : "M3 3h18v18H3V3z"
            } />
          </svg>
        </button>
      </div>
    </div>
  )
}