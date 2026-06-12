import api from "../../../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { useEffect, useState } from "react";
import { Loader2, Radio } from "lucide-react";

interface Device {
  id: number;
  device_names: string;
  mac_devices: string;
  rssi1: number | null;
  rssi2: number | null;
  rssi3: number | null;
  tipe_device: string; // Diubah dari boolean -> string ("Anchor")
  status: number | string; // Mengizinkan string maupun number dari database
  x: number | null;
  y: number | null;
  created_at: string;
  updated_at: string;
}

export function DashboardCard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/devices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = res.data?.data || res.data || [];
        setDevices(Array.isArray(rawData) ? rawData : []);
      } catch (err: any) {
        setError(err.message || "Gagal sinkronisasi data");
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card variant="brutal">
        <Loader2 className="animate-spin h-5 w-5 text-zinc-900 dark:text-zinc-100" />
        <p className="text-xs font-black  tracking-widest text-zinc-400">
          Memuat Sinyal Node...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="brutal">
        <p className="text-xs font-black  text-zinc-400 tracking-wider">
          Error: {error}
        </p>
      </Card>
    );
  }

  const total = devices.length;

  const online = devices.filter((d) => Number(d.status) === 1).length;
  const offline = devices.filter((d) => Number(d.status) === 0).length;

  return (
    <Card variant="brutal" animate={false}>
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                <Radio
                  size={14}
                  className={online > 0 ? "animate-pulse" : ""}
                />
              </div>
              <p className="text-xs text-zinc-900 dark:text-zinc-500">
                Active Tags Monitor
              </p>
            </div>

            {/* Indikator Status Minimalis Monokrom */}
            <div className="flex gap-3 items-center text-[10px] font-mono font-black  tracking-wider">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2  border  rounded-full ${online > 0 ? "bg-green-500 border-green-500 dark:bg-green-100 dark:border-zinc-100 animate-pulse" : "bg-green-100 border-green-300"}`}
                />
                <p className="text-zinc-700 dark:text-zinc-300">
                  {online} Online
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2  border  rounded-full ${offline > 0 ? "bg-red-400 border-red-400" : "bg-red-200 border-red-200"}`}
                />
                <p className="text-zinc-400 dark:text-zinc-600">
                  {offline} Offline
                </p>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2 pb-4">
        <p className="font-black text-3xl tracking-tight text-ge-900 dark:text-zinc-50  ">
          {online}
          <span className="font-light text-zinc-400 font-sans not-italic text-sm mx-1">
            / {total}
          </span>
          <span className="text-sm font-bold font-sans  text-zinc-900  tracking-normal capitalize">
            Devices Active
          </span>
        </p>
      </CardContent>

      <CardFooter className="pt-2 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20  flex justify-end gap-1.5 text-zinc-400 dark:text-zinc-500 font-mono text-xs font-bold  tracking-wider">
        <span>Sync At:</span>
        <span>
          {new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}{" "}
          WIB
        </span>
      </CardFooter>
    </Card>
  );
}
