import React, { useState } from "react";
import { Input } from "../ui/input";
import { DeviceListItem } from "../molecules/DeviceListItem";
import { Search, SlidersHorizontal, Layers } from "lucide-react";

interface Device {
  id: number;
  device_names: string;
  mac_devices: string;
  status: number | string;
  x: number;
  y: number;
}

interface MapSidebarProps {
  devices: Device[];
  activeDeviceId: number | null;
  onSelectDevice: (device: Device) => void;
}

export function MapSidebar({
  devices,
  activeDeviceId,
  onSelectDevice,
}: MapSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = devices.filter(
    (d) =>
      d.device_names?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.mac_devices?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full lg:w-80 h-full flex flex-col bg-zinc-950 border-r border-zinc-900 p-5 shrink-0 space-y-5">
      {/* Search Bar Input */}
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3.5 text-zinc-600" />
        <Input
          placeholder="Cari tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 rounded-xl border-zinc-900 focus-visible:ring-zinc-700 bg-zinc-950 font-medium text-xs h-11 text-zinc-300 placeholder:text-zinc-600 w-full"
        />
      </div>

      {/* Filter Toolbar Mini */}
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500 pb-1 border-b border-zinc-900">
        <div className="flex items-center gap-1.5">
          <Layers size={11} />
          <span>Active Nodes ({filteredDevices.length})</span>
        </div>
      </div>

      {/* List Container Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar max-h-[500px] lg:max-h-none">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <DeviceListItem
              key={device.id}
              name={device.device_names}
              mac={device.mac_devices}
              x={device.x}
              y={device.y}
              status={device.status ?? 1}
              isActive={activeDeviceId === device.id}
              onClick={() => onSelectDevice(device)}
            />
          ))
        ) : (
          <div className="py-12 text-center text-zinc-600 font-mono text-[10px] uppercase font-bold">
            Node tidak terdeteksi
          </div>
        )}
      </div>
    </div>
  );
}
