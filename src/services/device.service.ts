import axios from "axios";
import type { Device } from "../types/Device";

export async function getDevices(): Promise<Device[]> {
  const res = await axios.get("api/device");
  return res.data.data;
}
