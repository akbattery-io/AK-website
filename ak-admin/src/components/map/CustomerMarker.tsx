"use client";

import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CustomerMapItem } from "@/types/customerMap";
import CustomerPopup from "./CustomerPopup";

interface CustomerMarkerProps {
  customer: CustomerMapItem;
  isSelected?: boolean;
}

const getMarkerColor = (status: CustomerMapItem["status"]) => {
  switch (status) {
    case "Active":
      return "#10b981"; // Green
    case "Inactive":
      return "#f43f5e"; // Red
    case "AMC Due Soon":
      return "#f59e0b"; // Orange
    default:
      return "#64748b"; // Gray
  }
};

const createCustomIcon = (status: CustomerMapItem["status"], isSelected: boolean) => {
  const color = getMarkerColor(status);
  const size = isSelected ? 36 : 28;

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.35));">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export default function CustomerMarker({ customer, isSelected = false }: CustomerMarkerProps) {
  if (customer.latitude === null || customer.longitude === null) return null;

  const icon = useMemo(() => createCustomIcon(customer.status, isSelected), [customer.status, isSelected]);

  return (
    <Marker position={[customer.latitude, customer.longitude]} icon={icon}>
      <Popup className="customer-leaflet-popup">
        <CustomerPopup customer={customer} />
      </Popup>
    </Marker>
  );
}
