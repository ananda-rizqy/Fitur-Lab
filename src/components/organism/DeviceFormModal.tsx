import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MyButton } from "../../components/atoms/Button";
import { FormField } from "../molecules/FormField";
import { IconX, IconLoader2 } from "@tabler/icons-react";

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
}

export function DeviceFormModal({
  isOpen,
  onClose,
  onSubmit,
}: DeviceFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deviceNames: "",
    macDevices: "",
    tipeDevice: "Anchor",
    coordX: "",
    coordY: "",
    rssi1: "0",
    rssi2: "0",
    rssi3: "0",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="w-full inset-0 fixed flex items-center justify-center z-1050 bg-zinc-900/40 dark:bg-zinc-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <Card className="w-full max-w-md rounded-[2.5rem] border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(9,9,11,1)] dark:shadow-none bg-white dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="pb-2 flex flex-row items-center justify-between border-b-2 border-zinc-100 dark:border-zinc-800/50">
          <div>
            <CardTitle className="text-xl font-black italic uppercase text-zinc-900 dark:text-white">
              Add New Device
            </CardTitle>
            <p className="text-[10px] text-zinc-400 font-mono font-bold uppercase mt-0.5">
              Parameter Node & Anchor Lab
            </p>
          </div>
          <MyButton
            onClick={onClose}
            className="w-8 h-8 p-0 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
          >
            <IconX size={14} />
          </MyButton>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <FormField
              label="Device Name"
              value={formData.deviceNames}
              onChange={(e) =>
                setFormData({ ...formData, deviceNames: e.target.value })
              }
              placeholder="Contoh: Node_Beta_ESP32"
              required
            />
            <FormField
              label="MAC Address"
              value={formData.macDevices}
              onChange={(e) =>
                setFormData({ ...formData, macDevices: e.target.value })
              }
              placeholder="Contoh: 24:0A:C4:8A:58:A0"
              required
            />
            <FormField
              label="Tipe Perangkat"
              as="select"
              value={formData.tipeDevice}
              onChange={(e) =>
                setFormData({ ...formData, tipeDevice: e.target.value })
              }
            >
              <option value="Anchor">Anchor (Fixed)</option>
              <option value="Beacon">Beacon (Target)</option>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Koordinat X (Meter)"
                type="number"
                step="0.01"
                value={formData.coordX}
                onChange={(e) =>
                  setFormData({ ...formData, coordX: e.target.value })
                }
                placeholder="0.00"
              />
              <FormField
                label="Koordinat Y (Meter)"
                type="number"
                step="0.01"
                value={formData.coordY}
                onChange={(e) =>
                  setFormData({ ...formData, coordY: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                label="RSSI 1 (dBm)"
                type="number"
                value={formData.rssi1}
                onChange={(e) =>
                  setFormData({ ...formData, rssi1: e.target.value })
                }
              />
              <FormField
                label="RSSI 2 (dBm)"
                type="number"
                value={formData.rssi2}
                onChange={(e) =>
                  setFormData({ ...formData, rssi2: e.target.value })
                }
              />
              <FormField
                label="RSSI 3 (dBm)"
                type="number"
                value={formData.rssi3}
                onChange={(e) =>
                  setFormData({ ...formData, rssi3: e.target.value })
                }
              />
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t-2 border-zinc-100 dark:border-zinc-800/50 flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl font-bold text-xs"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl px-5 border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
            >
              {submitting ? (
                <IconLoader2 className="animate-spin h-4 w-4" />
              ) : (
                "Simpan Device"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
