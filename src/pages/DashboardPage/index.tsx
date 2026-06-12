import { useEffect, useState, useCallback } from "react";
import { DashboardCard } from "../../components/organism/Dashboard";
import { MapLab } from "../../components/organism/Map/Map";
import { RefreshCw, Monitor, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { PageLayout } from "../../layouts/PageLayout";
import { Button } from "../../components/ui/button";

export function Dashboard() {
  const [devices, setDevices] = useState<any[]>([]);
  const [focusTarget, setFocusTarget] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/devices");
      setDevices(response.data.data || response.data || []);
    } catch (err) {
      console.error("Gagal memuat map data di dashboard:", err);
      setError("Gagal menyinkronkan data koordinat node BLE.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardDevices();
  }, [fetchDashboardDevices]);

  return (
    <PageLayout
      pageTitle="Sistem Pemantauan Alat"
      pageDescription="Pelacakan posisi aset inventaris laboratorium secara real-time berbasis RSSI."
    >
      <div className="py-6 w-full space-y-8 antialiased selection:bg-zinc-900 dark:selection:bg-white selection:text-white dark:selection:text-zinc-950 text-left transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <DashboardCard />
        </div>

        <div className="flex flex-col space-y-3 w-full">
          <div className="flex items-center gap-2 px-1">
            <Monitor size={14} className="text-zinc-400" />
            <h2 className="text-[10px] font-mono font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
              Denah Node Aktif Lokalisasi
            </h2>
          </div>

          <div className="relative border-2 border-zinc-950 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none h-[400px] sm:h-[500px] lg:h-[580px] transition-all rounded-none">
            {error && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-xs text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center text-red-500 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                  <AlertCircle size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-mono font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-tight">
                    Koneksi Gateway Gagal
                  </h4>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 max-w-xs">
                    {error}
                  </p>
                </div>
                <Button
                  onClick={fetchDashboardDevices}
                  variant="brutal"
                  size="sm"
                  className="rounded-none font-mono font-black text-xs uppercase tracking-wider px-4"
                >
                  Coba Lagi
                </Button>
              </div>
            )}

            <MapLab devices={devices} focusTarget={focusTarget} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
