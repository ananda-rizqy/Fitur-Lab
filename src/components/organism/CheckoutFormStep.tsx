import * as React from "react";
import Webcam from "react-webcam";
import {
  Camera,
  RefreshCw,
  X,
  MapPin,
  FileText,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CheckoutFormStepProps {
  targetRoom: string;
  setTargetRoom: (v: string) => void;
  tujuan: string;
  setTujuan: (v: string) => void;
  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;
  showCamera: boolean;
  setShowCamera: (v: boolean) => void;
  imagePreview: string | null;
  webcamRef: React.RefObject<Webcam | null>;
  onCapture: () => void;
  captchaString: string;
  captchaInput: string;
  setCaptchaInput: (v: string) => void;
  onRefreshCaptcha: () => void;
  rooms: string[];
}

const videoConstraints = {
  facingMode: {
    ideal: "environment",
  },
};

export function CheckoutFormStep({
  targetRoom,
  setTargetRoom,
  tujuan,
  setTujuan,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  showCamera,
  setShowCamera,
  imagePreview,
  webcamRef,
  onCapture,
  captchaString,
  captchaInput,
  setCaptchaInput,
  onRefreshCaptcha,
  rooms,
}: CheckoutFormStepProps) {
  return (
    <ScrollArea className="h-[70vh] w-full pr-3 text-left">
      <div className="space-y-5 pb-4 pl-0.5">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 se tracking-widest flex items-center gap-1.5 pl-0.5">
            <MapPin size={11} className="text-zinc-400" />
            <span>Lokasi Penggunaan:</span>
          </Label>
          <Select value={targetRoom} onValueChange={setTargetRoom}>
            <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none font-mono font-black text-xs text-zinc-900 dark:text-white tracking-wider">
              <SelectValue placeholder="Pilih Ruangan" />
            </SelectTrigger>
            <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs  text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
              {rooms.map((r) => (
                <SelectItem
                  key={r}
                  value={r}
                  className="cursor-pointer font-mono font-black rounded-none"
                >
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500  tracking-widest flex items-center gap-1.5 pl-0.5">
            <FileText size={11} className="text-zinc-400" />
            <span>Tujuan Penggunaan:</span>
          </Label>
          <Input
            placeholder="Praktikum Jaringan Komputer"
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            className="h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none font-sans font-black text-xs  tracking-wide placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:border-zinc-950"
          />
        </div>

        <Card className="p-4 border-2 border-zinc-950 dark:border-zinc-800 rounded-none bg-zinc-50/50 dark:bg-zinc-950/20 shadow-none gap-4 flex flex-col">
          <Label className="text-xs font-mono font-black text-zinc-900 dark:text-white  tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-zinc-400" />
            <span>Penjadwalan Praktikum (Booking)</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest  pl-0.5">
                Mulai / Booking:
              </Label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker()}
                className="font-mono h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none text-xs font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest  pl-0.5">
                Estimasi Selesai:
              </Label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker()}
                className="font-mono h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none text-xs font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
              />
            </div>
          </div>
          {!startTime && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-wider  mt-1 leading-normal pl-0.5">
              * Kosongkan kolom waktu jika Anda ingin langsung meminjam dan
              menggunakan alat di laboratorium saat ini.
            </p>
          )}
        </Card>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500  tracking-widest flex items-center gap-1.5 pl-0.5">
            <Camera size={11} className="text-zinc-400" />
            <span>Foto Kondisi Fisik Alat (Before):</span>
          </Label>
          {!showCamera ? (
            <div
              onClick={() => setShowCamera(true)}
              className="w-full h-40 bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-950 dark:hover:border-zinc-500 transition-all overflow-hidden group rounded-none"
            >
              {imagePreview ? (
                <div className="w-full h-full relative">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover transition-all duration-200"
                    alt="Preview Keadaan Alat"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-mono font-black  tracking-widest bg-zinc-950/90 px-3 py-1.5 border border-zinc-700">
                      Ambil Foto Ulang
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none mb-3 group-hover:scale-105 transition-transform">
                    <Camera size={15} />
                  </div>
                  <span className="text-xs font-mono font-black tracking-widest  text-zinc-400 dark:text-zinc-500 text-center px-4 leading-normal">
                    Klik Area Untuk Mengaktifkan Kamera 
                    Jika pemesanan tidak wajib ambil foto 
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="relative h-48 overflow-hidden bg-black border-2 border-zinc-950 dark:border-zinc-800 shadow-inner animate-in fade-in duration-150 rounded-none">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "environment",
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3 z-20">
                <Button
                  type="button"
                  variant="brutal"
                  color="red"
                  size="sm"
                  onClick={() => setShowCamera(false)}
                  className="rounded-none h-9 w-9 px-0 flex items-center justify-center shadow-none"
                >
                  <X size={13} />
                </Button>
                <Button
                  type="button"
                  variant="brutal"
                  size="sm"
                  onClick={onCapture}
                  className="rounded-none h-9 px-4 text-xs font-mono font-black  tracking-wider"
                >
                  <Camera size={13} className="mr-1" /> AMBIL GAMBAR
                </Button>
              </div>
            </div>
          )}
        </div>

        <Card
          variant="brutal"
          className="p-4 bg-zinc-50 dark:bg-zinc-950/40 shadow-none active:translate-0 hover:translate-x-0 hover:translate-y-0 hover:shadow-none flex flex-col gap-3.5 rounded-none"
        >
          <Label className="text-xs font-mono font-black text-zinc-900 dark:text-white  tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-zinc-400" />
            <span>Verifikasi Keamanan Captcha</span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white dark:bg-zinc-950 h-11 flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-800 select-none tracking-[0.4em] font-mono font-black  text-base text-zinc-900 dark:text-zinc-100 shadow-inner rounded-none">
              {captchaString}
            </div>

            <Button
              type="button"
              variant="brutal"
              size="icon"
              onClick={onRefreshCaptcha}
              className="h-11 w-11 shrink-0 bg-white dark:bg-zinc-900 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
            >
              <RefreshCw
                size={13}
                className="text-zinc-700 dark:text-zinc-300"
              />
            </Button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              placeholder="KETIK KODE CAPTCHA DI SINI"
              className="h-11 text-center font-black font-mono tracking-[0.2em] bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none text-xs"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
            />
            {captchaInput && captchaInput !== captchaString && (
              <p className="text-xs text-red-500 dark:text-red-400 font-mono font-black  text-center tracking-wider mt-1.5 animate-pulse leading-normal">
                [ ⚠️ WARNING: KODE CAPTCHA TIDAK COCOK ]
              </p>
            )}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
