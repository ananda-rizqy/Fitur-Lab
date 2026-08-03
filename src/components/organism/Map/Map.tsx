// @ts-nocheck
import { useEffect, useRef } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import L from "leaflet";

import "leaflet.marker.slideto";
import "leaflet/dist/leaflet.css";

export type Device = {
  id: number;
  device_names: string;
  mac_devices: string;
  status?: number | string;
  x: number;
  y: number;
  updated_at?: string;
};

type LabConfig = {
  id: string;
  name: string;
  imageUrl: string;
  bounds: LatLngBoundsExpression;
};

interface MapLabProps {
  devices: Device[];
  focusTarget: LatLngTuple | null;
}

const scale = 100;

const LAB_BARAT_01: LabConfig = {
  id: "lab-barat-01",
  name: "Lab Barat 02",
  imageUrl: "/img/lab_barat_01.jpeg",
  bounds: [
    [0, 0],
    [870, 740],
  ],
};

function MapController({ focusTarget }: { focusTarget: LatLngTuple | null }) {
  const map = useMap();
  useEffect(() => {
    if (focusTarget) {
      map.setView(focusTarget, 0.5, { animate: true, duration: 1 });
    }
  }, [focusTarget, map]);
  return null;
}

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

export function MapLab({ devices, focusTarget }: MapLabProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  return (
    <div className="w-full h-full relative z-10 bg-zinc-100 overflow-hidden border border-zinc-200/80 shadow-xs group/map">
      <div className="absolute top-6 right-6 z-1000">
        <div className="px-3 py-1.5 bg-white border-2 border-zinc-950 font-sans font-bold text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{LAB_BARAT_01.name}</span>
        </div>
      </div>

      <MapContainer
        key={LAB_BARAT_01.id}
        crs={L.CRS.Simple}
        bounds={LAB_BARAT_01.bounds}
        minZoom={-1}
        maxZoom={1}
        className="w-full h-full"
        ref={(el) => {
          mapRef.current = el;
        }}
      >
        <FitBounds bounds={LAB_BARAT_01.bounds} />
        <MapController focusTarget={focusTarget} />
        <ImageOverlay
          url={LAB_BARAT_01.imageUrl}
          bounds={LAB_BARAT_01.bounds}
        />

        <DevicesLayerInternal devices={devices} markersRef={markersRef} />
      </MapContainer>
    </div>
  );
}

function DevicesLayerInternal({
  devices,
  markersRef,
}: {
  devices: Device[];
  markersRef: React.MutableRefObject<Map<number, L.Marker>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!devices || !Array.isArray(devices)) return;

    // 1. Kumpulkan ID dari devices online yang masuk dari props
    const incomingOnlineIds = new Set(devices.map((d) => d.id));

    // 2. Bersihkan marker lama yang ada di peta tapi tidak ada di data online terbaru
    markersRef.current.forEach((marker, id) => {
      if (!incomingOnlineIds.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    // 3. Render / Update marker untuk device yang online
    devices.forEach((device) => {
      if (!device || device.x === undefined || device.y === undefined) return;

      const posX = Number(device.x) * scale;
      const posY = Number(device.y) * scale;
      const position: LatLngTuple = [posY, posX];

      const customHTML = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-9 h-9 bg-zinc-950/10 border border-zinc-950/20 animate-ping rounded-full" style="animation-duration: 1.5s;"></div>
          <div class="relative w-5 h-5 bg-zinc-950 border-2 border-white flex items-center justify-center shadow-md transition-transform hover:scale-125 rounded-full">
            <div class="w-1.5 h-1.5 bg-white animate-pulse rounded-full"></div>
          </div>
        </div>
      `;

      const deviceIcon = L.divIcon({
        html: customHTML,
        className: "custom-leaflet-marker-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const generatePopupContent = () => `
        <div class="p-5 bg-white text-zinc-900 border-2 border-zinc-950 text-left min-w-[280px] max-w-[320px] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] font-sans space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-11 w-11 bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0 font-black text-xs font-mono shadow-inner">
              ${device.device_names ? device.device_names.substring(0, 2).toUpperCase() : "TG"}
            </div>
            <div class="overflow-hidden">
              <h4 class="text-sm font-black uppercase tracking-tight text-zinc-900 leading-tight italic truncate">
                ${device.device_names || "Unknown Tag"}
              </h4>
              <p class="text-[10px] font-mono font-bold text-zinc-400 tracking-wide mt-0.5 truncate">
                MAC: ${device.mac_devices || "---"}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1 p-2.5 bg-zinc-50 border-2 border-zinc-100 text-center items-center">
            <div class="flex items-center justify-center gap-1 text-[10px] font-mono font-black text-emerald-600">
              <span class="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full"></span>
              <span>ON</span>
            </div>
            <div class="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-zinc-400 border-x-2 border-zinc-200">
              <span>X:</span>
              <span class="font-black text-zinc-800">${Number(device.x).toFixed(1)}</span>
            </div>
            <div class="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-zinc-400">
              <span>Y:</span>
              <span class="font-black text-zinc-800">${Number(device.y).toFixed(1)}</span>
            </div>
          </div>

        
        </div>
      `;

      if (!markersRef.current.has(device.id)) {
        // Buat marker baru jika belum terdaftar
        const marker = L.marker(position, { icon: deviceIcon }).addTo(map);
        marker.bindPopup(generatePopupContent(), {
          className: "brutalism-leaflet-popup",
          closeButton: false,
        });
        markersRef.current.set(device.id, marker);
      } else {
        // Geser posisi marker jika sudah ada menggunakan slideTo
        const marker = markersRef.current.get(device.id);
        if (marker) {
          marker.setIcon(deviceIcon);
          (marker as any).slideTo(position, {
            duration: 400,
            keepAtCenter: false,
          });

          const popup = marker.getPopup();
          if (popup && marker.isPopupOpen()) {
            popup.setContent(generatePopupContent());
          }
        }
      }
    });
  }, [devices, map, markersRef]);

  return null;
}
