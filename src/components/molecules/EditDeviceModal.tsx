import { useState, useEffect } from "react";
import api from "../../services/api";

interface Device {
  id: number;
  device_names: string;
  mac_devices: string;
  tipe_device: string;
  status: boolean | number | string;
}

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  deviceData: Device | null;
}

export function EditDeviceModal({
  isOpen,
  onClose,
  onSuccess,
  deviceData,
}: EditDeviceModalProps) {
  const [deviceName, setDeviceName] = useState("");
  const [tipeDevice, setTipeDevice] = useState("");
  const [loading, setLoading] = useState(false);

  // Set nilai form ketika data device terpilih masuk
  useEffect(() => {
    if (deviceData) {
      setDeviceName(deviceData.device_names);
      setTipeDevice(deviceData.tipe_device);
    }
  }, [deviceData]);

  if (!isOpen || !deviceData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    try {
      setLoading(true);
      // Panggil API update data ke Laravel
      await api.put(`/devices/${deviceData.id}`, {
        device_names: deviceName,
        tipe_device: tipeDevice,
      });
      alert("Device berhasil diperbarui!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui data device.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-mono antialiased">
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 p-6 w-full max-w-md rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-zinc-950 pb-2 mb-4">
          Edit Node Device
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-black uppercase">
              MAC Address (Read Only)
            </label>
            <input
              type="text"
              value={deviceData.mac_devices}
              disabled
              className="h-10 px-3 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 font-bold outline-none cursor-not-allowed text-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-black uppercase">Device Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required
              className="h-10 px-3 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-black uppercase">Type Device</label>
            <input
              type="text"
              value={tipeDevice}
              onChange={(e) => setTipeDevice(e.target.value)}
              required
              className="h-10 px-3 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 border-2 border-zinc-300 font-black uppercase hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 border-2 border-zinc-950 bg-zinc-950 text-white font-black uppercase hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}