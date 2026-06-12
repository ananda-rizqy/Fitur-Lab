import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Webcam from "react-webcam";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Camera, PackageCheck, Loader2, Info, X, Check } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { PageLayout } from "../../../layouts/PageLayout";

type LoanDetail = {
  id: number;
  peminjaman_id: string;
  alat_id: string;
  jumlah_pinjam: string;
  alat: {
    id: number;
    nama_alat: string;
    letak: string;
  };
};

type LoanItem = {
  id: number;
  ruangan_lab: string;
  status: string;
  tujuan_penggunaan?: string;
  details: LoanDetail[];
};

export default function PengembalianAlatPage() {
  const [activeLoans, setActiveLoans] = useState<LoanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const [cameraActiveId, setCameraActiveId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    [key: number]: {
      file: File | null;
      preview: string | null;
      kondisi: string;
      catatan: string;
    };
  }>({});

  const fetchActiveLoans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/mahasiswa/riwayat-saya");
      const rawData = res.data?.data || res.data || [];

      const ongoing = rawData.filter((item: any) => {
        const currentStatus = item.status?.toLowerCase().trim();
        return currentStatus === "berlangsung" || currentStatus === "disetujui";
      });

      setActiveLoans(ongoing);
    } catch (err) {
      console.error("Gagal mengambil data pinjaman alat:", err);
      setActiveLoans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveLoans();
  }, [fetchActiveLoans]);

  const capture = useCallback((id: number) => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFormData((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || { kondisi: "baik", catatan: "" }),
          file: null,
          preview: imageSrc,
        },
      }));
      setCameraActiveId(null);
    }
  }, []);

  const handleInputChange = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          file: null,
          preview: null,
          kondisi: "baik",
          catatan: "",
        }),
        [field]: value,
      },
    }));
  };

  const handleReturn = async (id: number) => {
    const data = formData[id];

    if (!data?.preview) {
      return Swal.fire(
        "Dokumentasi Wajib",
        "Harap ambil foto bukti kondisi alat sebelum mengembalikan!",
        "warning",
      );
    }
    if (data.kondisi === "rusak" && !data.catatan.trim()) {
      return Swal.fire(
        "Catatan Diperlukan",
        "Deskripsi kerusakan alat wajib diisi.",
        "warning",
      );
    }

    setSubmittingId(id);

    const payload = {
      foto_after_base64: data.preview,
      kondisi_kembali: data.kondisi,
      deskripsi_kerusakan: data.catatan,
    };

    try {
      await api.post(`/peminjaman/${id}/kembalikan`, payload);

      Swal.fire({
        title: "Pengembalian Berhasil",
        text: "Alat praktikum telah diserahkan kembali.",
        icon: "success",
        confirmButtonColor: "#18181b",
      });
      fetchActiveLoans();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kendala saat memproses peminjaman.", "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = activeLoans.length;
    const totalAlat = activeLoans.reduce(
      (sum: number, item: any) => sum + (item.details?.length || 0),
      0,
    );
    return { total, totalAlat };
  }, [activeLoans]);

  return (
    <PageLayout
      pageTitle="Pengembalian Alat"
      pageDescription="Selesaikan peminjaman mandiri dengan melampirkan kondisi fisik akhir inventaris praktikum."
    >
      <div className="py-6 w-full space-y-8 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <div className=" pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="flex gap-3 text-right self-start sm:self-center">
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 px-4 h-11 flex flex-col justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
              <p className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest ">
                Berkas Aktif
              </p>
              <p className="text-sm font-mono font-black text-zinc-900 dark:text-white">
                {stats.total} LOG
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 px-4 h-11 flex flex-col justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
              <p className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest ">
                Total Item
              </p>
              <p className="text-sm font-mono font-black text-zinc-900 dark:text-white">
                {stats.totalAlat} UNIT
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-3 w-full">
            <Loader2
              className="animate-spin text-zinc-950 dark:text-zinc-50"
              size={28}
            />
            <p className="text-xs font-mono font-black tracking-widest text-zinc-400 ">
              Menyinkronkan Log Berkas
            </p>
          </div>
        ) : activeLoans.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-800 p-8 rounded-none w-full">
            <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-4 rounded-none shadow-none">
              <PackageCheck size={20} />
            </div>
            <h3 className="font-mono font-black text-zinc-800 dark:text-zinc-200 tracking-widest text-sm ">
              Semua Tanggungan Aman
            </h3>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1.5 font-medium max-w-xs mx-auto">
              Kamu tidak memiliki pinjaman alat laboratorium yang berstatus
              aktif saat ini.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 w-full">
            {activeLoans.map((item: any) => (
              <Card
                key={item.id}
                variant="brutal"
                animate={false}
                className="p-0 border-2 border-zinc-950 dark:border-zinc-800 rounded-none overflow-hidden flex flex-col lg:flex-row py-0 w-full shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
              >
                <div className="lg:w-1/2 p-6 lg:p-8 bg-zinc-950 text-white flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-zinc-950">
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                      <span className="bg-white text-zinc-900 font-mono text-[9px] font-black px-2.5 py-1.5 rounded-none tracking-widest border border-white ">
                        ID REG: #{item.id}
                      </span>
                      <span className="text-sm text-zinc-100 font-mono font-black tracking-wider ">
                        Ruangan: {item.ruangan_lab || "LAB BARAT"}
                      </span>
                    </div>

                    <h3 className="text-xs font-mono font-black mt-6 mb-4 tracking-widest text-zinc-400 ">
                      Inventaris Pinjaman
                    </h3>
                    <div className="space-y-2">
                      {item.details?.map((det: any) => (
                        <div
                          key={det.id}
                          className="flex justify-between p-3.5 bg-zinc-900 border border-zinc-800 rounded-none items-center"
                        >
                          <span className="font-black text-xs tracking-wide text-zinc-200 ">
                            {det.alat?.nama_alat || "Item Inventaris"}
                          </span>
                          <span className="text-white font-mono font-black text-xs bg-zinc-950 px-2.5 py-1 rounded-none border border-zinc-800">
                            QTY: {det.jumlah_pinjam}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-none text-left">
                      <p className="text-xs font-mono font-black text-zinc-400 tracking-widest ">
                        Keperluan Praktikum
                      </p>
                      <p className="text-xs text-zinc-200 font-medium mt-1">
                        "{item.tujuan_penggunaan || "Tidak melampirkan alasan"}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center gap-4 text-xs font-medium text-zinc-400 leading-normal text-left">
                    <Info size={14} className="shrink-0 text-white" />
                    <span>
                      Harap foto alat dalam posisi rapi di meja pengembalian
                      sebelum mengirim berkas laporan pemakaian ruang.
                    </span>
                  </div>
                </div>

                <div className="lg:w-1/2 p-6 lg:p-8 bg-white dark:bg-zinc-900 space-y-5 flex flex-col justify-between transition-colors">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest  pl-0.5">
                      Ambil Bukti Pengembalian
                    </Label>

                    {cameraActiveId === item.id ? (
                      <div className="relative w-full h-64 rounded-none overflow-hidden bg-black border-2 border-zinc-950 dark:border-zinc-800 shadow-inner">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={{ facingMode: "environment" }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 z-20">
                          <Button
                            type="button"
                            variant="brutal"
                            size="sm"
                            className="bg-red-500 text-white h-9 w-9 px-0 flex items-center justify-center rounded-none shadow-none"
                            onClick={() => setCameraActiveId(null)}
                          >
                            <X size={14} />
                          </Button>
                          <Button
                            type="button"
                            variant="brutal"
                            size="sm"
                            className="rounded-none h-9 px-4 font-mono font-black text-xs tracking-wider "
                            onClick={() => capture(item.id)}
                          >
                            <Camera size={13} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setCameraActiveId(item.id)}
                        className="w-full h-52 bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-none flex flex-col items-center justify-center cursor-pointer hover:border-zinc-950 dark:hover:border-zinc-400 transition-all overflow-hidden group"
                      >
                        {formData[item.id]?.preview ? (
                          <img
                            src={formData[item.id].preview!}
                            className="w-full h-full object-cover"
                            alt="Preview Jepretan"
                          />
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-none flex items-center justify-center text-zinc-900 dark:text-white shadow-none mb-3 group-hover:scale-105 transition-transform">
                              <Camera size={15} />
                            </div>
                            <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 tracking-widest font-mono  text-center px-4 leading-normal">
                              Klik area untuk menyalakan kamera dokumentasi
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest  pl-0.5">
                        Kondisi Alat
                      </Label>
                      <Select
                        value={formData[item.id]?.kondisi || "baik"}
                        onValueChange={(val) =>
                          handleInputChange(item.id, "kondisi", val)
                        }
                      >
                        <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none font-mono font-black text-xs text-zinc-900 dark:text-zinc-100  tracking-wide">
                          <SelectValue placeholder="Pilih Kondisi Alat" />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs  text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                          <SelectItem
                            value="baik"
                            className="cursor-pointer rounded-none"
                          >
                            Kondisi Baik
                          </SelectItem>
                          <SelectItem
                            value="rusak"
                            className="cursor-pointer rounded-none"
                          >
                            Kondisi Rusak
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest  pl-0.5">
                        Catatan Tambahan
                      </Label>
                      <Input
                        type="text"
                        placeholder="Lengkap"
                        onChange={(e) =>
                          handleInputChange(item.id, "catatan", e.target.value)
                        }
                        className="w-full h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-black tracking-wide rounded-none shadow-none focus-visible:ring-0  placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleReturn(item.id)}
                    disabled={submittingId === item.id}
                    className="w-full h-12 "
                    color="green"
                    variant="brutal"
                  >
                    {submittingId === item.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Memproses Pengembalian...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Check size={14} />
                        <span>Selesaikan Restitusi</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
