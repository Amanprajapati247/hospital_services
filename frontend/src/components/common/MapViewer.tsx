import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HospitalListItem } from '../../types';

interface MapViewerProps {
  hospitals: HospitalListItem[];
  center?: [number, number];
  zoom?: number;
  selectedHospitalId?: number;
  onMarkerClick?: (h: HospitalListItem) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  hospitals,
  center = [22.7296, 75.8777],
  zoom = 12,
  onMarkerClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: false
    });

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when hospitals list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom HTML Pin Icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background-color: #0d9488; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    hospitals.forEach(h => {
      if (h.latitude && h.longitude) {
        const marker = L.marker([h.latitude, h.longitude], { icon: customIcon }).addTo(map);
        
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 11px; font-weight: bold; color: #0d9488; text-transform: uppercase;">${h.area}</div>
            <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 2px;">${h.name}</div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-top: 6px;">
              <span>⭐ ${h.rating.toFixed(1)}</span>
              <span>ICU: <strong style="color: #059669;">${h.icu_avail}</strong> Avail</span>
            </div>
            <div style="font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 4px;">
              Consultation: ₹${h.starting_fee}
            </div>
            <a href="/hospitals/${h.id}" style="display: block; margin-top: 8px; text-align: center; background: #0d9488; color: white; text-decoration: none; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px;">
              View Details
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(h);
        });
        markersRef.current.push(marker);
      }
    });

    // Fit bounds if markers exist
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [hospitals]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
    </div>
  );
};
