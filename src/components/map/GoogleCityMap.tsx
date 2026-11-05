// Source: Google Maps Platform Code Assist
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Layers,
  Search,
  Compass,
  Navigation,
  Activity,
  AlertTriangle,
  RotateCcw,
  Radio,
  Hospital as HospitalIcon,
  Flame,
  Shield,
  Truck,
  Droplet,
  AlertOctagon,
  LifeBuoy,
  ZoomIn,
  ZoomOut,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useEmergenx } from '../../context/EmergenxContext';
import { VehicleCategory, EmergencyVehicle, TrafficIntersection, HospitalFacility } from '../../types';

// Category color mappings
const CATEGORY_COLORS: Record<VehicleCategory, { bg: string; text: string; border: string }> = {
  ambulance: { bg: '#ef4444', text: '#ffffff', border: '#b91c1c' },
  fire_engine: { bg: '#f97316', text: '#ffffff', border: '#c2410c' },
  police: { bg: '#3b82f6', text: '#ffffff', border: '#1d4ed8' },
  disaster_rescue: { bg: '#eab308', text: '#000000', border: '#ca8a04' },
  blood_transport: { bg: '#dc2626', text: '#ffffff', border: '#991b1b' },
  other: { bg: '#8b5cf6', text: '#ffffff', border: '#6d28d9' },
};

// Bangalore emergency stations
const EMERGENCY_STATIONS = [
  { id: 'st_fire_01', name: 'Mayo Hall Fire & Emergency HQ', type: 'fire_station', location: { lat: 12.9720, lng: 77.6150 }, address: 'Residency Rd, Ashok Nagar', phone: '101' },
  { id: 'st_fire_02', name: 'Indiranagar Fire Station', type: 'fire_station', location: { lat: 12.9780, lng: 77.6430 }, address: '100ft Road, HAL 2nd Stage', phone: '101' },
  { id: 'st_pol_01', name: 'Ashok Nagar Traffic Police Station', type: 'police_station', location: { lat: 12.9735, lng: 77.6060 }, address: 'Museum Rd / Brigade Rd', phone: '103' },
  { id: 'st_pol_02', name: 'Cubbon Park Police Outpost', type: 'police_station', location: { lat: 12.9760, lng: 77.5930 }, address: 'Kasturba Rd, Sampangi Rama Nagar', phone: '100' },
  { id: 'st_pol_03', name: 'Halasuru Law Enforcement Base', type: 'police_station', location: { lat: 12.9740, lng: 77.6240 }, address: 'Old Madras Rd, Halasuru', phone: '103' },
];

// Active emergency incidents on map
const INCIDENT_LOCATIONS = [
  { id: 'inc_01', title: 'Cardiac STEMI Emergency', location: { lat: 12.9752, lng: 77.6012 }, address: 'High Court Gates, Ambedkar Veedhi', severity: 'critical', assignedCallSign: 'MEDIC-101' },
  { id: 'inc_02', title: 'Commercial 3rd-Floor Fire', location: { lat: 12.9745, lng: 77.6095 }, address: 'Brigade Road Commercial Complex', severity: 'high', assignedCallSign: 'BRONTO-01' },
  { id: 'inc_03', title: 'Highway Multiple Collision', location: { lat: 12.9664, lng: 77.6189 }, address: 'Ulsoor Lake North Access', severity: 'critical', assignedCallSign: 'TRAUMA-202' },
];

// Inner helper component to manage traffic layer, polylines, and camera
const MapController: React.FC<{
  showTraffic: boolean;
  mapType: google.maps.MapTypeId;
  focusVehicle: EmergencyVehicle | undefined;
  activeRouteWaypoints: { lat: number; lng: number }[];
  isConflictMode: boolean;
}> = ({ showTraffic, mapType, focusVehicle, activeRouteWaypoints, isConflictMode }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const routePolylinesRef = useRef<google.maps.Polyline[]>([]);

  // Toggle Traffic Layer
  useEffect(() => {
    if (!map) return;
    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(map);
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
  }, [map, showTraffic]);

  // Set Map Type
  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(mapType);
  }, [map, mapType]);

  // Pan to focus vehicle
  useEffect(() => {
    if (!map || !focusVehicle) return;
    map.panTo({
      lat: focusVehicle.currentLocation.lat,
      lng: focusVehicle.currentLocation.lng,
    });
  }, [map, focusVehicle]);

  // Render Routes (Single Green Corridor vs Multi-Vehicle Conflict Routes)
  useEffect(() => {
    if (!map) return;

    // Clean previous polylines
    routePolylinesRef.current.forEach((p) => p.setMap(null));
    routePolylinesRef.current = [];

    if (isConflictMode) {
      // 1. Ambulance Route (Green)
      const ambPath = [
        { lat: 12.9752, lng: 77.6012 },
        { lat: 12.9738, lng: 77.6074 },
        { lat: 12.9723, lng: 77.6206 },
        { lat: 12.9610, lng: 77.6387 },
        { lat: 12.9592, lng: 77.6486 },
      ];
      const ambLine = new google.maps.Polyline({
        path: ambPath,
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.9,
        strokeWeight: 5,
        map,
      });

      // 2. Fire Engine Route (Orange)
      const firePath = [
        { lat: 12.9720, lng: 77.6150 },
        { lat: 12.9728, lng: 77.6111 },
        { lat: 12.9738, lng: 77.6074 },
        { lat: 12.9745, lng: 77.6095 },
      ];
      const fireLine = new google.maps.Polyline({
        path: firePath,
        geodesic: true,
        strokeColor: '#f97316',
        strokeOpacity: 0.9,
        strokeWeight: 5,
        map,
      });

      // 3. Police Escort Route (Blue)
      const polPath = [
        { lat: 12.9650, lng: 77.6074 },
        { lat: 12.9700, lng: 77.6074 },
        { lat: 12.9738, lng: 77.6074 },
      ];
      const polLine = new google.maps.Polyline({
        path: polPath,
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map,
      });

      routePolylinesRef.current = [ambLine, fireLine, polLine];
    } else if (activeRouteWaypoints && activeRouteWaypoints.length > 1) {
      // Active Green Corridor Glow + Line
      const glowLine = new google.maps.Polyline({
        path: activeRouteWaypoints,
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.35,
        strokeWeight: 10,
        map,
      });

      const mainLine = new google.maps.Polyline({
        path: activeRouteWaypoints,
        geodesic: true,
        strokeColor: '#059669',
        strokeOpacity: 0.95,
        strokeWeight: 4,
        map,
      });

      routePolylinesRef.current = [glowLine, mainLine];
    }

    return () => {
      routePolylinesRef.current.forEach((p) => p.setMap(null));
      routePolylinesRef.current = [];
    };
  }, [map, isConflictMode, activeRouteWaypoints]);

  return null;
};

export const GoogleCityMap: React.FC<{
  className?: string;
  showCongestionOverlay?: boolean;
  showIntersections?: boolean;
  showHospitals?: boolean;
  focusVehicleId?: string | null;
  conflictMode?: boolean;
}> = ({
  className = 'h-full w-full',
  showCongestionOverlay = true,
  showIntersections = true,
  showHospitals = true,
  focusVehicleId,
  conflictMode = false,
}) => {
  const {
    vehicles,
    intersections,
    hospitals,
    routes,
    activeRouteId,
    networkStatus,
    gpsStaleSeconds,
    setSelectedVehicleId,
    setSelectedIntersectionId,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useEmergenx();

  // Maps API Key state
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || (window as any).__GMP_API_KEY__ || ''
  );
  const [isKeyLoading, setIsKeyLoading] = useState<boolean>(!apiKey);

  // Map Controls State
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [mapType, setMapType] = useState<google.maps.MapTypeId>(
    'roadmap' as google.maps.MapTypeId
  );
  const [bangaloreDemoMode, setBangaloreDemoMode] = useState<boolean>(true);

  // Selected Marker InfoWindow state
  const [activeInfoWindow, setActiveInfoWindow] = useState<{
    type: 'vehicle' | 'intersection' | 'hospital' | 'station' | 'incident';
    data: any;
    position: { lat: number; lng: number };
  } | null>(null);

  // Search Address / Places input
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodedCenter, setGeocodedCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Load API key from server if not in client env
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/config/maps-key')
        .then((res) => res.json())
        .then((data) => {
          if (data.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch((err) => console.warn('Could not fetch maps key from server:', err))
        .finally(() => setIsKeyLoading(false));
    }
  }, [apiKey]);

  const activeRoute = routes.find((r) => r.id === activeRouteId);
  const activeWaypoints = activeRoute ? activeRoute.waypoints : [];
  const focusVehicle = vehicles.find((v) => v.id === focusVehicleId);

  // Handle Geocoding Search
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;

    setIsGeocoding(true);
    try {
      const res = await fetch('/api/maps/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: searchAddress }),
      });
      const data = await res.json();
      if (data.lat && data.lng) {
        setGeocodedCenter({ lat: data.lat, lng: data.lng });
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.callSign.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.assignedService.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={`relative ${className} flex flex-col bg-slate-900 select-none`}>
      {/* Top Map Control Bar */}
      <div className="z-10 bg-slate-900/95 border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-sm">
        {/* Geocoding / Places Search Box */}
        <form onSubmit={handleAddressSearch} className="flex items-center gap-1.5 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Bangalore hospital, fire base, junction..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isGeocoding}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors cursor-pointer shrink-0"
          >
            {isGeocoding ? 'Locating...' : 'Search'}
          </button>
        </form>

        {/* Action Controls & Layer Toggles */}
        <div className="flex items-center gap-2">
          {/* Traffic Layer Toggle */}
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              showTraffic
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Traffic</span>
          </button>

          {/* Map Type Switcher */}
          <select
            value={mapType}
            onChange={(e) => setMapType(e.target.value as google.maps.MapTypeId)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium outline-none cursor-pointer"
          >
            <option value="roadmap">Roadmap</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybrid</option>
            <option value="terrain">Terrain</option>
          </select>

          {/* Bangalore Demo Mode Switch */}
          <button
            onClick={() => {
              setBangaloreDemoMode(!bangaloreDemoMode);
              setGeocodedCenter({ lat: 12.9716, lng: 77.6150 });
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
              bangaloreDemoMode
                ? 'bg-blue-950 text-blue-300 border-blue-700'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Bangalore Grid</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative flex-1 w-full overflow-hidden">
        <APIProvider apiKey={apiKey}>
          <GoogleMap
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            defaultCenter={{ lat: 12.9716, lng: 77.6150 }}
            center={geocodedCenter || undefined}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="h-full w-full"
          >
            {/* Map Controller for Traffic Layer and Dynamic Polylines */}
            <MapController
              showTraffic={showTraffic}
              mapType={mapType}
              focusVehicle={focusVehicle}
              activeRouteWaypoints={activeWaypoints}
              isConflictMode={conflictMode}
            />

            {/* 1. Emergency Vehicles Markers */}
            {filteredVehicles.map((veh) => {
              const color = CATEGORY_COLORS[veh.category] || CATEGORY_COLORS.other;
              const isEnRoute = veh.status === 'en_route' || veh.status === 'transporting';
              const isStale = networkStatus === 'offline' || veh.gpsStatus === 'stale';

              return (
                <AdvancedMarker
                  key={veh.id}
                  position={{ lat: veh.currentLocation.lat, lng: veh.currentLocation.lng }}
                  onClick={() => {
                    setSelectedVehicleId(veh.id);
                    setActiveInfoWindow({
                      type: 'vehicle',
                      data: veh,
                      position: { lat: veh.currentLocation.lat, lng: veh.currentLocation.lng },
                    });
                  }}
                  title={veh.callSign}
                >
                  <div className="relative flex flex-col items-center cursor-pointer group">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shadow-xl border-2 text-white font-bold text-[10px] tracking-wider transition-transform group-hover:scale-125 ${
                        isStale ? 'border-dashed border-amber-400' : 'border-solid border-white'
                      } ${isEnRoute ? 'beacon-active' : ''}`}
                      style={{ backgroundColor: color.bg }}
                    >
                      {veh.category === 'ambulance' ? (
                        <Truck className="w-4 h-4" />
                      ) : veh.category === 'fire_engine' ? (
                        <Flame className="w-4 h-4" />
                      ) : veh.category === 'police' ? (
                        <Shield className="w-4 h-4" />
                      ) : veh.category === 'blood_transport' ? (
                        <Droplet className="w-4 h-4" />
                      ) : (
                        <LifeBuoy className="w-4 h-4" />
                      )}
                    </div>
                    <div className="bg-slate-950/95 text-slate-200 text-[9px] font-mono px-1.5 py-0.2 rounded border border-slate-700 whitespace-nowrap shadow-md mt-0.5 pointer-events-none">
                      {veh.callSign.split(' ')[0]}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* 2. Traffic Intersections Markers */}
            {showIntersections &&
              intersections.map((inter) => {
                let dotColor = '#22c55e';
                let pulseClass = '';
                if (inter.currentSignal === 'RED' || inter.currentSignal === 'ALL_RED_HOLD') {
                  dotColor = '#ef4444';
                } else if (inter.currentSignal === 'AMBER') {
                  dotColor = '#f59e0b';
                } else if (inter.currentSignal === 'PRIORITY_GREEN') {
                  dotColor = '#10b981';
                  pulseClass = 'beacon-active';
                }

                // If conflictMode is on and it's the convergence intersection, highlight with warning halo!
                const isConflictJunction = conflictMode && inter.id === 'int_01';

                return (
                  <AdvancedMarker
                    key={inter.id}
                    position={{ lat: inter.location.lat, lng: inter.location.lng }}
                    onClick={() => {
                      setSelectedIntersectionId(inter.id);
                      setActiveInfoWindow({
                        type: 'intersection',
                        data: inter,
                        position: { lat: inter.location.lat, lng: inter.location.lng },
                      });
                    }}
                    title={inter.name}
                  >
                    <div
                      className={`relative flex items-center justify-center rounded-full bg-slate-900 border-2 shadow-lg cursor-pointer ${
                        isConflictJunction
                          ? 'w-9 h-9 border-red-500 animate-bounce'
                          : `w-6 h-6 ${pulseClass}`
                      }`}
                      style={{ borderColor: isConflictJunction ? '#ef4444' : dotColor }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: isConflictJunction ? '#ef4444' : dotColor }}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* 3. Hospitals Markers */}
            {showHospitals &&
              hospitals.map((hosp) => (
                <AdvancedMarker
                  key={hosp.id}
                  position={{ lat: hosp.location.lat, lng: hosp.location.lng }}
                  onClick={() =>
                    setActiveInfoWindow({
                      type: 'hospital',
                      data: hosp,
                      position: { lat: hosp.location.lat, lng: hosp.location.lng },
                    })
                  }
                  title={hosp.name}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-xs shadow-xl border-2 border-white cursor-pointer hover:scale-115 transition-transform">
                    H
                  </div>
                </AdvancedMarker>
              ))}

            {/* 4. Emergency Stations (Fire & Police) */}
            {EMERGENCY_STATIONS.map((st) => (
              <AdvancedMarker
                key={st.id}
                position={{ lat: st.location.lat, lng: st.location.lng }}
                onClick={() =>
                  setActiveInfoWindow({
                    type: 'station',
                    data: st,
                    position: { lat: st.location.lat, lng: st.location.lng },
                  })
                }
                title={st.name}
              >
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-md border-2 border-white shadow-lg text-white font-bold text-xs cursor-pointer hover:scale-110 transition-transform ${
                    st.type === 'fire_station' ? 'bg-orange-600' : 'bg-blue-800'
                  }`}
                >
                  {st.type === 'fire_station' ? <Flame className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                </div>
              </AdvancedMarker>
            ))}

            {/* 5. Active Incident Locations */}
            {INCIDENT_LOCATIONS.map((inc) => (
              <AdvancedMarker
                key={inc.id}
                position={{ lat: inc.location.lat, lng: inc.location.lng }}
                onClick={() =>
                  setActiveInfoWindow({
                    type: 'incident',
                    data: inc,
                    position: { lat: inc.location.lat, lng: inc.location.lng },
                  })
                }
                title={inc.title}
              >
                <div className="relative flex items-center justify-center cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg border-2 border-white beacon-active">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}

            {/* Dynamic InfoWindow Popup */}
            {activeInfoWindow && (
              <InfoWindow
                position={activeInfoWindow.position}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="text-slate-900 max-w-xs font-sans text-xs p-1">
                  {activeInfoWindow.type === 'vehicle' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-red-600 uppercase">
                          {activeInfoWindow.data.category.replace('_', ' ')}
                        </span>
                        <span className="font-bold">{activeInfoWindow.data.status}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">{activeInfoWindow.data.callSign}</h4>
                      <p className="text-[11px] text-slate-600">{activeInfoWindow.data.assignedService}</p>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block">Speed</span>
                          <strong>{activeInfoWindow.data.currentSpeedKmh} km/h</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Driver</span>
                          <strong>{activeInfoWindow.data.driverName}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-700">
                        Location: <strong>{activeInfoWindow.data.locationName}</strong>
                      </p>
                    </div>
                  )}

                  {activeInfoWindow.type === 'intersection' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-500">
                          {activeInfoWindow.data.id.toUpperCase()}
                        </span>
                        <span className="font-bold text-emerald-700">
                          {activeInfoWindow.data.currentSignal.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm">{activeInfoWindow.data.name}</h4>
                      <p className="text-[11px] text-slate-600">Cross: {activeInfoWindow.data.crossStreetName}</p>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block">Queue Length</span>
                          <strong>{activeInfoWindow.data.queueLengthMeters}m</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Civilian Queue</span>
                          <strong>{activeInfoWindow.data.queueVehicles} units</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoWindow.type === 'hospital' && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold text-teal-700">
                        Receiving Trauma Facility
                      </span>
                      <h4 className="font-bold text-sm">{activeInfoWindow.data.name}</h4>
                      <p className="text-[11px] text-slate-600">{activeInfoWindow.data.address}</p>
                      <div className="grid grid-cols-2 gap-2 bg-teal-50 p-1.5 rounded text-[11px] font-mono text-teal-950">
                        <div>
                          <span className="text-teal-700 block">Trauma Bays</span>
                          <strong>{activeInfoWindow.data.availableTraumaBeds} Available</strong>
                        </div>
                        <div>
                          <span className="text-teal-700 block">ICU Beds</span>
                          <strong>{activeInfoWindow.data.availableIcuBeds} Available</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoWindow.type === 'station' && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold text-blue-700">
                        {activeInfoWindow.data.type === 'fire_station' ? 'Fire Base Station' : 'Police Station'}
                      </span>
                      <h4 className="font-bold text-sm">{activeInfoWindow.data.name}</h4>
                      <p className="text-[11px] text-slate-600">{activeInfoWindow.data.address}</p>
                      <p className="text-[11px] font-mono">Emergency Line: {activeInfoWindow.data.phone}</p>
                    </div>
                  )}

                  {activeInfoWindow.type === 'incident' && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold text-red-700">
                        Active Emergency Ground
                      </span>
                      <h4 className="font-bold text-sm">{activeInfoWindow.data.title}</h4>
                      <p className="text-[11px] text-slate-600">{activeInfoWindow.data.address}</p>
                      <p className="text-[11px] font-mono text-red-600">
                        Assigned Unit: <strong>{activeInfoWindow.data.assignedCallSign}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </APIProvider>

        {/* Floating Stale GPS Safeguard Indicator */}
        {networkStatus !== 'normal' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[20] bg-amber-950/90 text-amber-200 border border-amber-600/80 px-4 py-1.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-mono backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>
              {networkStatus === 'offline'
                ? `GPS TELEMETRY STALE (${gpsStaleSeconds}s): Preserving last verified transponder coordinates`
                : 'WEAK SIGNAL: Retrying telemetric packet sync...'}
            </span>
          </div>
        )}

        {/* Conflict Mode Floating Indicator */}
        {conflictMode && (
          <div className="absolute top-3 right-3 z-[20] bg-red-950/95 text-red-200 border border-red-700/80 px-3.5 py-2 rounded-lg shadow-xl text-xs space-y-1 max-w-xs backdrop-blur-sm">
            <div className="font-bold flex items-center gap-1.5 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Multi-Vehicle Route Overlap Active</span>
            </div>
            <p className="text-[11px] text-red-300">
              Shared Intersection: <strong>MG Road & Brigade Road Junction</strong>. Priority corridor staggered by AI Decision Engine.
            </p>
          </div>
        )}

        {/* Route Comparison Overlay Panel */}
        {activeRoute && !conflictMode && (
          <div className="absolute bottom-3 right-3 z-[20] bg-slate-900/95 border border-slate-800 p-3.5 rounded-xl shadow-2xl max-w-sm text-xs text-slate-200 backdrop-blur-md hidden sm:block">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">Google Routes API Corridor</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {activeRoute.recommended ? 'RECOMMENDED' : 'ALTERNATIVE'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-2">{activeRoute.name}</p>

            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Distance</span>
                <span className="font-bold text-slate-100">{activeRoute.distanceKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ETA</span>
                <span className="font-bold text-emerald-400">{activeRoute.estimatedMinutes} min</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Reliability</span>
                <span className="font-bold text-blue-400">{activeRoute.reliabilityScorePercent}%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Traffic: {activeRoute.congestionLevel} · Intersections: {activeRoute.intersectionsCount}
            </p>
          </div>
        )}

        {/* Interactive Map Legend */}
        <div className="absolute bottom-3 left-3 z-[20] bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-md p-2.5 shadow-xl text-[11px] text-slate-300 hidden md:block">
          <div className="font-semibold text-slate-200 mb-1.5 text-xs">Google Maps Platform Grid</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span>Ambulance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
              <span>Fire Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              <span>Police Patrol</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Green Signal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 inline-block text-[9px] text-white text-center font-bold">H</span>
              <span>Hospital ER</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-600 inline-block text-[9px] text-white text-center font-bold">F</span>
              <span>Fire / Police Base</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
