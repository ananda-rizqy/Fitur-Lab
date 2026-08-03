import * as React from "react";
import Webcam from "react-webcam";
import api from "../../services/api";
import {
  Camera,
  RefreshCw,
  X,
  MapPin,
  FileText, 
  CalendarDays,
  ShieldCheck,
  BookOpen,
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
  kodeMatkul: string;
  setKodeMatkul: (v: string) => void;
  mataKuliah: string;
  setMataKuliah: (v: string) => void;
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
  rooms: any[];
}

export function CheckoutFormStep({
  targetRoom,
  setTargetRoom,
  kodeMatkul,
  setKodeMatkul,
  mataKuliah,
  setMataKuliah,
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
  rooms: propRooms,
}: CheckoutFormStepProps) {

  const isBookingMode = startTime !== "" && endTime !== "";
  
  // State untuk Mata Kuliah & Ruangan
  const [loadingMatkul, setLoadingMatkul] = React.useState(true);
  const [daftarMatkul, setDaftarMatkul] = React.useState<any[]>([]);
  
  const [loadingRooms, setLoadingRooms] = React.useState(true);
  const [daftarRooms, setDaftarRooms] = React.useState<any[]>([]);

  // Fetch data mata kuliah dan ruangan saat komponen dimuat
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMatkul(true);
        setLoadingRooms(true);

        // 1. Ambil Data Mata Kuliah
        const resMatkul = await api.get("/jadwal-polines");
        console.log("RESPONSE MATKUL:", resMatkul.data);
        const jsonMatkul = resMatkul.data;
        
        if (jsonMatkul && jsonMatkul.data) {
          const rawData = Array.isArray(jsonMatkul.data) ? jsonMatkul.data : (jsonMatkul.data.data || []);
          
          // Filter unik berdasarkan nama mata kuliah agar tidak duplikat di dropdown
          const uniqueMatkul = Array.from(
            new Set(rawData.map((item) => item.nama_matkul))
          ).map((nama) => {
            return rawData.find((item) => item.nama_matkul === nama);
          });

          setDaftarMatkul(uniqueMatkul);
        }

        // 2. Ambil Data Ruangan secara langsung dari endpoint backend
        const resRooms = await api.get("/ruangan-labs");
        if (resRooms.data) {
          const roomData = Array.isArray(resRooms.data) ? resRooms.data : resRooms.data.data;
          setDaftarRooms(roomData || []);
        }

      } catch (err) {
        console.error("Gagal mengambil data form:", err);
      } finally {
        setLoadingMatkul(false);
        setLoadingRooms(false);
      }
    };

    fetchData();
  }, []);

  // Handler saat matkul dipilih
  const handleMatkulChange = (selectedNama: string) => {
    const selectedMatkul = daftarMatkul.find((item) => item.nama_matkul === selectedNama);
    setMataKuliah(selectedNama);
    setKodeMatkul(selectedMatkul ? selectedMatkul.kode_matkul : "");
  };

  // Menggabungkan sumber data ruangan dari props atau fetch mandiri
  const activeRooms = (Array.isArray(propRooms) && propRooms.length > 0) ? propRooms : daftarRooms;

  return (
    <ScrollArea className="h-[70vh] w-full pr-3 text-left">
      <div className="space-y-5 pb-4 pl-0.5">
        
        {/* Dropdown Lokasi Penggunaan (Ruangan) */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest flex items-center gap-1.5 pl-0.5">
            <MapPin size={11} className="text-zinc-400" />
            <span>Lokasi Penggunaan:</span>
          </Label>
          <Select value={targetRoom} onValueChange={setTargetRoom}>
            <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none font-mono font-black text-xs text-zinc-900 dark:text-white tracking-wider">
              <SelectValue placeholder={loadingRooms ? "Memuat ruangan..." : "Pilih Ruangan"} />
            </SelectTrigger>
            <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
              {loadingRooms ? (
                <div className="p-3 text-xs font-mono text-zinc-500 text-center">Memuat data ruangan...</div>
              ) : activeRooms.length > 0 ? (
                activeRooms.map((r, index) => {
                  const roomId = typeof r === "object" && r !== null ? (r.id || index) : r;
                  const roomName = typeof r === "object" && r !== null ? (r.nama_ruangan || r.name) : r;

                  return (
                    <SelectItem
                      key={roomId}
                      value={String(roomId)}
                      className="cursor-pointer font-mono font-black rounded-none"
                    >
                      {roomName}
                    </SelectItem>
                  );
                })
              ) : (
                <div className="p-3 text-xs font-mono text-zinc-500 text-center">Data ruangan tidak ditemukan</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Dropdown Mata Kuliah */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest flex items-center gap-1.5 pl-0.5">
            <BookOpen size={11} className="text-zinc-400" />
            <span>Mata Kuliah:</span>
          </Label>
          <Select value={mataKuliah} onValueChange={handleMatkulChange}>
            <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none font-mono font-black text-xs text-zinc-900 dark:text-white tracking-wider">
              <SelectValue placeholder={loadingMatkul ? "Memuat data..." : "Pilih Mata Kuliah"} />
            </SelectTrigger>
            <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
              {loadingMatkul ? (
                <div className="p-3 text-xs font-mono text-zinc-500 text-center">Menarik data server...</div>
              ) : daftarMatkul.length > 0 ? (
                daftarMatkul.map((item, index) => (
                  <SelectItem
                    key={index}
                    value={item.nama_matkul}
                    className="cursor-pointer font-mono font-black rounded-none"
                  >
                    {item.nama_matkul} ({item.kode_matkul})
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-xs font-mono text-zinc-500 text-center">Data tidak ditemukan</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest flex items-center gap-1.5 pl-0.5">
            <FileText size={11} className="text-zinc-400" />
            <span>Tujuan Penggunaan:</span>
          </Label>
          <Input
            placeholder="Praktikum Jaringan Komputer"
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            className="h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none font-sans font-black text-xs tracking-wide placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:border-zinc-950"
          />
        </div>

        <Card className="p-4 border-2 border-zinc-950 dark:border-zinc-800 rounded-none bg-zinc-50/50 dark:bg-zinc-950/20 shadow-none gap-4 flex flex-col">
          <Label className="text-xs font-mono font-black text-zinc-900 dark:text-white tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-zinc-400" />
            <span>Penjadwalan Praktikum</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest pl-0.5">
                Mulai 
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
              <Label className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest pl-0.5">
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
        </Card>

        <Card
          variant="brutal"
          className="p-4 bg-zinc-50 dark:bg-zinc-950/40 shadow-none active:translate-0 hover:translate-x-0 hover:translate-y-0 hover:shadow-none flex flex-col gap-3.5 rounded-none"
        >
          <Label className="text-xs font-mono font-black text-zinc-900 dark:text-white tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-zinc-400" />
            <span>Verifikasi Keamanan Captcha</span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white dark:bg-zinc-950 h-11 flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-800 select-none tracking-[0.4em] font-mono font-black text-base text-zinc-900 dark:text-zinc-100 shadow-inner rounded-none">
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
              <p className="text-xs text-red-500 dark:text-red-400 font-mono font-black text-center tracking-wider mt-1.5 animate-pulse leading-normal">
                [ ⚠️ WARNING: KODE CAPTCHA TIDAK COCOK ]
              </p>
            )}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}