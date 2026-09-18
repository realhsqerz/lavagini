"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L from "leaflet";
import { Loader2, Locate, MapPin } from "lucide-react";

import "leaflet/dist/leaflet.css";

export type MapPosition = { lat: number; lng: number };

const pinIcon = L.divIcon({
  className: "map-pin",
  html: `<svg width="30" height="39" viewBox="0 0 30 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.7 0 0 6.7 0 15c0 11.25 15 24 15 24s15-12.75 15-24C30 6.7 23.3 0 15 0z" fill="#2563EB" stroke="white" stroke-width="2"/><circle cx="15" cy="15" r="6" fill="white"/></svg>`,
  iconSize: [30, 39],
  iconAnchor: [15, 39],
  popupAnchor: [0, -34],
});

const DEFAULT_CENTER: LatLngTuple = [35.8256, 10.6089];

export function MapPicker({
  position,
  onPositionChange,
}: {
  position: MapPosition | null;
  onPositionChange: (position: MapPosition, address: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  async function handlePick(lat: number, lng: number) {
    setGeoError("");
    setLoading(true);
    onPositionChange({ lat, lng }, "");
    const address = await reverseGeocode(lat, lng);
    setLoading(false);
    if (address) {
      onPositionChange({ lat, lng }, address);
    }
  }

  function handleLocate() {
    if (!("geolocation" in navigator)) {
      setGeoError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setGeoError("");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (positionResult) => {
        const { latitude, longitude } = positionResult.coords;
        onPositionChange({ lat: latitude, lng: longitude }, "");
        const address = await reverseGeocode(latitude, longitude);
        setLoading(false);
        if (address) {
          onPositionChange({ lat: latitude, lng: longitude }, address);
        }
      },
      () => {
        setLoading(false);
        setGeoError(
          "Impossible d'accéder à votre position. Activez la localisation ou placez le repère directement sur la carte.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={13}
          zoomControl
          scrollWheelZoom={false}
          className="map-picker h-72 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCatcher onPick={handlePick} />
          {position ? (
            <Marker
              position={[position.lat, position.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = (event.target as L.Marker).getLatLng();
                  void handlePick(marker.lat, marker.lng);
                },
              }}
            />
          ) : null}
          <FlyTo position={position} />
        </MapContainer>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          Touchez la carte pour placer le repère, ou déplacez-le.
        </p>
        <button
          type="button"
          onClick={handleLocate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4" />
          )}
          Utiliser ma position
        </button>
      </div>

      {loading ? (
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Recherche de l'adresse...
        </p>
      ) : null}

      {geoError ? <p className="text-sm text-red-600">{geoError}</p> : null}
    </div>
  );
}

function ClickCatcher({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function FlyTo({ position }: { position: MapPosition | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [position, map]);

  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=fr`,
      { headers: { Accept: "application/json" } },
    );
    if (!response.ok) {
      throw new Error("reverse geocoding failed");
    }
    const data = (await response.json()) as { display_name?: string };
    if (data.display_name) {
      return data.display_name.replace(/,\s*Tunisie$/, "");
    }
    return "";
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}