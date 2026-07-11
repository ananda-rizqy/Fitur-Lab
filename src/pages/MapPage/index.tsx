import { useEffect, useState, useCallback, useMemo } from "react";
import { MapLab } from "../../components/organism/Map/Map";
import { MapSidebar } from "../../components/organism/MapSidebar";
import type { LatLngTuple } from "leaflet";
import { Radio, AlertCircle } from "lucide-react";
import api from "../../services/api";
// import echo from "../../lib/echo";
import { PageLayout } from "../../layouts/PageLayout";
import { Button } from "../../components/ui/button";

export function MapLabPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<LatLngTuple | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fungsi penarikan inisialisasi awal data node perangkat
  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/devices");
      setDevices(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching radar devices:", err);
      setError("Gagal mengambil data inisialisasi node radar.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // 2. 💡 PROSES FILTER: Hanya loloskan perangkat yang benar-benar ONLINE (Toleransi 5 Menit)
  const onlyOnlineDevices = useMemo(() => {
    return devices.filter((device) => {
      const val = device.status;
      const rawDate = device.updated_at;

      // Logika dasar keaktifan status
      const isStatusActive =
        val === true ||
        val === 1 ||
        val === "1" ||
        String(val).toLowerCase().trim() === "online" ||
        String(val).toLowerCase().trim() === "active";

      // Logika pembatasan waktu timeout 5 menit
      let isTimedOut = false;
      if (rawDate && String(rawDate).trim() !== "-") {
        const lastUpdateTime = new Date(rawDate).getTime();
        const currentTime = new Date().getTime();
        const durationInMinutes = (currentTime - lastUpdateTime) / (1000 * 60);

        if (durationInMinutes > 5) {
          isTimedOut = true;
        }
      } else {
        // Jika tidak ada catatan waktu update, otomatis anggap offline
        isTimedOut = true;
      }

      return isStatusActive && !isTimedOut;
    });
  }, [devices]);

  const handleSelectDevice = useCallback((device: any) => {
    setActiveDeviceId(device.id);
    const scale = 100;
    setFocusTarget([Number(device.y) * scale, Number(device.x) * scale]);
  }, []);

  return (
    <PageLayout
      pageTitle="Trilateration Radar"
      pageDescription="Pemantauan koordinat posisi tag BLE RSSI secara realtime di dalam denah grid ruang Laboratorium."
    >
      <div className="py-6 w-full space-y-6 antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-left transition-colors duration-300">
        <div className=" pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-wider bg-white dark:bg-zinc-900 px-4 h-11 rounded-none border-2 border-zinc-950 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none whitespace-nowrap">
              <Radio
                size={12}
                className="text-emerald-500 animate-pulse shrink-0"
              />
              <span>
                Realtime Feed Active ({onlyOnlineDevices.length} Nodes)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row border-2 border-zinc-950 dark:border-zinc-800 rounded-none overflow-hidden bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none h-[750px] lg:h-[680px] w-full relative">
          {error && (
            <div className="absolute inset-0 z-1050 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-none bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center text-red-500 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-black text-zinc-900 dark:text-zinc-100">
                  Koneksi Stream Terputus
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm font-medium">
                  {error}
                </p>
              </div>
              <Button
                onClick={fetchDevices}
                variant="brutal"
                className="h-11 px-5 rounded-none font-mono font-black text-xs tracking-wider"
              >
                Hubungkan Kembali
              </Button>
            </div>
          )}

          {/* 💡 Perbaikan: Kirim data 'onlyOnlineDevices' ke Sidebar */}
          <div className="w-full lg:w-[340px] h-2/5 lg:h-full border-b-2 lg:border-b-0 lg:border-r-2 border-zinc-200 dark:border-zinc-800 overflow-y-auto shrink-0">
            <MapSidebar
              devices={onlyOnlineDevices}
              activeDeviceId={activeDeviceId}
              onSelectDevice={handleSelectDevice}
            />
          </div>

          <div className="flex-1 h-3/5 lg:h-full relative bg-zinc-100 dark:bg-zinc-950">
            <MapLab devices={onlyOnlineDevices} focusTarget={focusTarget} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}