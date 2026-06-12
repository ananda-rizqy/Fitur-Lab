import { useEffect, useState } from "react";
import { getDevices } from "../services/device.service";
import type { Device } from "../types/Device";

export function useDevices() {
  const [data, setData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDevices()
      .then(setData)
      .catch(() => setError("Failed to fetch devices"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
