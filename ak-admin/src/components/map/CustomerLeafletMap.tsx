"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { CustomerMapItem } from "@/types/customerMap";
import CustomerMarker from "./CustomerMarker";

// Helper component to handle map bounds fitting
function MapBoundsFitter({
  customers,
  selectedCustomerId,
}: {
  customers: CustomerMapItem[];
  selectedCustomerId: string | null;
}) {
  const map = useMap();
  const hasInitialFitRef = useRef(false);

  useEffect(() => {
    // 1. If a specific customer is selected, center & zoom directly on that customer
    if (selectedCustomerId) {
      const selected = customers.find((c) => c.id === selectedCustomerId);
      if (selected && selected.latitude !== null && selected.longitude !== null) {
        map.flyTo([selected.latitude, selected.longitude], 15, { duration: 1.2 });
        return;
      }
    }

    // 2. Perform initial bounds fit ONCE only when data first arrives, do not auto-zoom on filter clicks
    if (!hasInitialFitRef.current && customers.length > 0) {
      const validCoords = customers.filter(
        (c): c is CustomerMapItem & { latitude: number; longitude: number } =>
          c.latitude !== null && c.longitude !== null
      );

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords.map((c) => [c.latitude, c.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        hasInitialFitRef.current = true;
      }
    }
  }, [customers, selectedCustomerId, map]);

  return null;
}

interface CustomerLeafletMapProps {
  customers: CustomerMapItem[];
  selectedCustomerId: string | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export default function CustomerLeafletMap({
  customers,
  selectedCustomerId,
  defaultCenter = [13.0827, 80.2707], // Default Chennai, TN coordinates
  defaultZoom = 11,
}: CustomerLeafletMapProps) {
  return (
    <div className="w-full h-full min-h-[520px] rounded-md overflow-hidden border border-slate-200/80 shadow-sm relative z-10">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[520px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsFitter
          customers={customers}
          selectedCustomerId={selectedCustomerId}
        />

        {/* Customer Location Markers */}
        {customers.map((c) => (
          <CustomerMarker key={c.id} customer={c} isSelected={selectedCustomerId === c.id} />
        ))}
      </MapContainer>
    </div>
  );
}
