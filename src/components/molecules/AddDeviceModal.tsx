import React, { useState } from "react";
import { Button } from "../ui/button";
import { OverlayModal } from "../atoms/OverlayModal";
import { IconLoader2 } from "@tabler/icons-react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDeviceModal({
  isOpen,
  onClose,
  onSuccess,
}: AddDeviceModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const [deviceNames, setDeviceNames] = useState("");
  const [macDevices, setMacDevices] = useState("");
  const [tipeDevice, setTipeDevice] = useState("Anchor");
  const [coordX, setCoordX] = useState("");
  const [coordY, setCoordY] = useState("");
  const [rssi1Input, setRssi1Input] = useState("0");
  const [rssi2Input, setRssi2Input] = useState("0");
  const [rssi3Input, setRssi3Input] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceNames || !macDevices) {
      return Swal.fire(
        "Form Belum Lengkap",
        "Device Name dan MAC Address wajib diisi.",
        "warning",
      );
    }

    setSubmitting(true);
    try {
      const payload = {
        device_names: deviceNames,
        mac_devices: macDevices,
        tipe_device: tipeDevice,
        status: 1,
        x: coordX ? parseFloat(coordX) : 0,
        y: coordY ? parseFloat(coordY) : 0,
        rssi: rssi1Input ? parseInt(rssi1Input) : 0,
        rssi1: rssi1Input ? parseInt(rssi1Input) : 0,
        rssi2: rssi2Input ? parseInt(rssi2Input) : 0,
        rssi3: rssi3Input ? parseInt(rssi3Input) : 0,
      };

      await api.post("/devices", payload);
      Swal.fire("Berhasil", "Perangkat baru berhasil disimpan.", "success");

      setDeviceNames("");
      setMacDevices("");
      setTipeDevice("Anchor");
      setCoordX("");
      setCoordY("");
      setRssi1Input("0");
      setRssi2Input("0");
      setRssi3Input("0");

      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire("Gagal Validasi", "Gagal menyimpan data perangkat.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OverlayModal isOpen={isOpen} onClose={onClose} title="Add New Device Form">
      {/* 👑 HEADER BAR CONTAINER */}
      <div className="p-6 pb-4 flex flex-row items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="text-left">
          <h2 className="text-lg font-mono font-black text-zinc-900 dark:text-white  tracking-wider">
            Add New Device
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black  mt-0.5 tracking-wider">
            Simpan Parameter Node dan Anchor Lab
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-white dark:bg-zinc-900 text-left">
          <div className="flex flex-col gap-1.5">
            <Label>Device Name</Label>
            <Input
              type="text"
              value={deviceNames}
              onChange={(e) => setDeviceNames(e.target.value)}
              placeholder="Contoh: Node_Beta_ESP32"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>MAC Address Devices</Label>
            <Input
              type="text"
              value={macDevices}
              onChange={(e) => setMacDevices(e.target.value)}
              placeholder="24:0A:C4:8A:58:A0"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Tipe Perangkat</Label>
            <select
              value={tipeDevice}
              onChange={(e) => setTipeDevice(e.target.value)}
              className="w-full p-3 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 outline-none font-mono font-black text-xs text-zinc-900 dark:text-zinc-100 cursor-pointer rounded-none shadow-none  tracking-wide"
            >
              <option value="Anchor">Anchor (Fixed)</option>
              <option value="Beacon">Beacon (Target)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Koordinat X (Meter)</Label>
              <Input
                type="number"
                step="0.01"
                value={coordX}
                onChange={(e) => setCoordX(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Koordinat Y (Meter)</Label>
              <Input
                type="number"
                step="0.01"
                value={coordY}
                onChange={(e) => setCoordY(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>RSSI 1 (dBm)</Label>
              <Input
                type="number"
                value={rssi1Input}
                onChange={(e) => setRssi1Input(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>RSSI 2 (dBm)</Label>
              <Input
                type="number"
                value={rssi2Input}
                onChange={(e) => setRssi2Input(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>RSSI 3 (dBm)</Label>
              <Input
                type="number"
                value={rssi3Input}
                onChange={(e) => setRssi3Input(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t-2 border-zinc-950 dark:border-zinc-800 flex gap-3 justify-end bg-zinc-50 dark:bg-zinc-950">
          <Button
            type="button"
            variant="brutal"
            onClick={onClose}
            className="rounded-none h-11 px-4 font-mono font-black text-xs tracking-wider "
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            variant="brutal"
            className="h-11"
            color="blue"
          >
            {submitting ? (
              <IconLoader2 className="animate-spin h-4 w-4" />
            ) : (
              "Simpan Device"
            )}
          </Button>
        </div>
      </form>
    </OverlayModal>
  );
}
