import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { VehicleTrackingData, Stop } from '../../types';
import { Bus, MapPin, Navigation } from 'lucide-react';

interface LiveMapViewProps {
  vehicles?: VehicleTrackingData[];
  selectedVehicleId?: number;
  onSelectVehicle?: (vehicle: VehicleTrackingData) => void;
  stops?: Stop[];
  routeCoordinates?: [number, number][];
  center?: [number, number];
  zoom?: number;
  height?: string;
  isInteractive?: boolean;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  stops = [],
  routeCoordinates = [],
  center = [40.7128, -74.006], // Standard default coordinate
  zoom = 13,
  height = '500px',
  isInteractive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: isInteractive,
        dragging: isInteractive,
        scrollWheelZoom: isInteractive,
        attributionControl: false,
      }).setView(center as [number, number], zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    // Render Stops
    stops.forEach((stop, index) => {
      if (stop.latitude && stop.longitude) {
        const stopLatLng: [number, number] = [stop.latitude, stop.longitude];
        bounds.push(stopLatLng);

        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          html: `
            <div style="
              background-color: #0284c7;
              color: #ffffff;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 12px;
              border: 2px solid #38bdf8;
              box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
            ">
              ${stop.sequenceOrder || index + 1}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(stopLatLng, { icon: stopIcon }).addTo(markersGroup);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 140px; background: #0a0a0a; color: #e2e8f0;">
            <p style="font-weight: 700; font-size: 13px; margin: 0; color: #ffffff;">Stop #${stop.sequenceOrder || index + 1}: ${stop.stopName}</p>
            <p style="font-size: 11px; margin: 4px 0 0 0; color: #94a3b8;">${stop.address || ''}</p>
            ${stop.pickupTime ? `<p style="font-size: 11px; margin: 4px 0 0 0; color: #34d399; font-weight: 600;">Pickup: ${stop.pickupTime}</p>` : ''}
          </div>
        `);
      }
    });

    // Render Route Polylines
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (routeCoordinates.length > 1) {
      polylineRef.current = L.polyline(routeCoordinates, {
        color: '#38bdf8',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
      }).addTo(map);
      routeCoordinates.forEach(pt => bounds.push(pt));
    } else if (stops.length > 1) {
      // Connect stops as route
      const stopPts: [number, number][] = stops
        .filter(s => s.latitude && s.longitude)
        .map(s => [s.latitude, s.longitude]);
      if (stopPts.length > 1) {
        polylineRef.current = L.polyline(stopPts, {
          color: '#38bdf8',
          weight: 4,
          opacity: 0.85,
        }).addTo(map);
      }
    }

    // Render Vehicles
    vehicles.forEach((vehicle) => {
      if (vehicle.latitude && vehicle.longitude) {
        const vehicleLatLng: [number, number] = [vehicle.latitude, vehicle.longitude];
        bounds.push(vehicleLatLng);

        const isSelected = selectedVehicleId === vehicle.vehicleId;

        const vehicleIcon = L.divIcon({
          className: 'custom-bus-marker',
          html: `
            <div style="position: relative;">
              <div style="
                position: absolute;
                top: -8px;
                left: -8px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: rgba(56, 189, 248, 0.25);
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                background-color: ${isSelected ? '#38bdf8' : '#0ea5e9'};
                color: ${isSelected ? '#020617' : '#ffffff'};
                width: 34px;
                height: 34px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #ffffff;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.6);
                transform: scale(${isSelected ? '1.15' : '1.0'});
                transition: transform 0.2s;
              ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 6v6"></path>
                  <path d="M15 6v6"></path>
                  <path d="M2 12h19.6"></path>
                  <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.2 6 18.2 6H5.8C4.8 6 3.9 6.8 3.6 7.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"></path>
                  <circle cx="7" cy="18" r="2"></circle>
                  <circle cx="17" cy="18" r="2"></circle>
                </svg>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker(vehicleLatLng, { icon: vehicleIcon }).addTo(markersGroup);

        marker.on('click', () => {
          if (onSelectVehicle) onSelectVehicle(vehicle);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; min-width: 170px; background: #0a0a0a; color: #e2e8f0;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-weight: 800; font-size: 14px; color: #ffffff;">${vehicle.vehicleNumber}</span>
              <span style="font-size: 10px; background: rgba(5, 150, 105, 0.3); color: #34d399; border: 1px solid rgba(5, 150, 105, 0.5); font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ${vehicle.speed ? `${Math.round(vehicle.speed)} km/h` : 'Moving'}
              </span>
            </div>
            <p style="font-size: 12px; margin: 6px 0 0 0; color: #cbd5e1;">Driver: <strong style="color: #ffffff;">${vehicle.driverName || 'Assigned Driver'}</strong></p>
            ${vehicle.routeName ? `<p style="font-size: 11px; margin: 4px 0 0 0; color: #38bdf8; font-weight: 600;">Route: ${vehicle.routeName}</p>` : ''}
            ${vehicle.nextStopName ? `<p style="font-size: 11px; margin: 4px 0 0 0; color: #fbbf24;">Next Stop: ${vehicle.nextStopName}</p>` : ''}
          </div>
        `);

        if (isSelected) {
          marker.openPopup();
        }
      }
    });

    // Auto-fit bounds if points exist
    if (bounds.length > 0 && map) {
      try {
        map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 15 });
      } catch {
        // Safe fallback
      }
    }
  }, [vehicles, stops, routeCoordinates, selectedVehicleId]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#1e293b] shadow-sm bg-[#050505]" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Floating Overlay Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <div className="bg-[#0a0a0a]/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#1e293b] shadow-xs text-xs font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live GPS Polling</span>
        </div>
      </div>

      {vehicles.length === 0 && stops.length === 0 && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="bg-[#0a0a0a]/95 backdrop-blur-xs px-4 py-3 rounded-xl border border-[#1e293b] shadow-2xl text-center max-w-xs">
            <Navigation className="w-5 h-5 text-[#38bdf8] mx-auto mb-1 animate-bounce" />
            <p className="text-xs font-semibold text-white">Awaiting GPS Telemetry</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Vehicles will appear when drivers start their trips</p>
          </div>
        </div>
      )}
    </div>
  );
};
