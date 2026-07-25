"use client";

import React, { useState } from "react";
import { Navigation, Target, RotateCcw } from "lucide-react";
import { RadiusSearchParams } from "@/types/customerMap";

interface RadiusSearchProps {
  onApplyRadiusSearch: (params: RadiusSearchParams | null) => void;
  isSearching: boolean;
}

export default function RadiusSearch({ onApplyRadiusSearch, isSearching }: RadiusSearchProps) {
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [radiusKm, setRadiusKm] = useState("15");
  const [active, setActive] = useState(false);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported by browser.");
      return;
    }
    setLocating(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatInput(pos.coords.latitude.toFixed(6));
        setLngInput(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      (err) => {
        console.error(err);
        setLocating(false);
        setErrorMsg("Unable to retrieve location permission.");
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput.trim());
    const lng = parseFloat(lngInput.trim());
    const rad = parseFloat(radiusKm.trim());

    if (isNaN(lat) || isNaN(lng) || isNaN(rad) || rad <= 0) {
      setErrorMsg("Please enter valid Latitude, Longitude, and Radius > 0.");
      return;
    }

    setErrorMsg(null);
    setActive(true);
    onApplyRadiusSearch({ latitude: lat, longitude: lng, radiusKm: rad });
  };

  const handleReset = () => {
    setLatInput("");
    setLngInput("");
    setRadiusKm("15");
    setActive(false);
    setErrorMsg(null);
    onApplyRadiusSearch(null);
  };

  return (
    <div className="bg-white rounded-md border border-slate-100 p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Customers Within Radius</h4>
        </div>
        {active && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
            Radius Filter Active ({radiusKm} km)
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-3 p-2.5 bg-amber-50 border border-amber-100 text-amber-800 rounded text-[11px] font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Center Latitude</label>
          <input
            type="text"
            placeholder="e.g. 13.0827"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            className="w-full h-9 px-3 border border-slate-200 rounded bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Center Longitude</label>
          <input
            type="text"
            placeholder="e.g. 80.2707"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            className="w-full h-9 px-3 border border-slate-200 rounded bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Radius (KM)</label>
          <input
            type="number"
            placeholder="15"
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            className="w-full h-9 px-3 border border-slate-200 rounded bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500"
            min={1}
            max={500}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="h-9 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 shrink-0"
            title="Use current GPS location"
          >
            <Navigation className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">{locating ? "Acquiring..." : "GPS"}</span>
          </button>

          <button
            type="submit"
            disabled={isSearching}
            className="h-9 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex-1 shadow-sm flex items-center justify-center gap-1.5"
          >
            {isSearching ? "Searching..." : "Apply Radius"}
          </button>
        </div>

        {active && (
          <div>
            <button
              type="button"
              onClick={handleReset}
              className="h-9 w-full border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Clear Radius</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
