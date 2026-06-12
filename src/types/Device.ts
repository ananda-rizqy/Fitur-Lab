export interface Device {
  id: number;
  device_names: string;
  mac_devices: string;
  rssi: number;
  tipe_device: boolean;
  status: boolean;
  x: number;
  y: number;
  time_stamp: number;
}

export interface DeviceUpdateEvent {
  device_names: Device;
}
