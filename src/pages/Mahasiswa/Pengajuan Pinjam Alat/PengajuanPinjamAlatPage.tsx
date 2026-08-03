import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Activity,
  Network,
  Cpu,
  Camera,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { PageLayout } from "../../../layouts/PageLayout";
import { InventoryTable } from "../../../components/organism/Table/InventoryTable";
import { LabGroupCard } from "../../../components/molecules/LabGroupCard";
import { CartDrawer } from "../../../components/organism/CartDrawer";
import { CartItemList } from "../../../components/organism/CartItemList";
import { CheckoutFormStep } from "../../../components/organism/CheckoutFormStep";
import { getColumns } from "./column"; 
import { type Alat } from "../../../types/Loan";
import { type ColumnDef } from "@tanstack/react-table";

import api from "../../../services/api";
import Swal from "sweetalert2";
import { LoanPagination } from "../../../components/organism/LoanPagination";

const LAB_GROUPS = [
  {
    name: "Laboratorium TK Barat",
    icon: Activity,
    color: "from-zinc-700 to-zinc-900",
  },
  {
    name: "Laboratorium TK Timur",
    icon: Network,
    color: "from-zinc-800 to-black",
  },
  {
    name: "Laboratorium TK IoT",
    icon: Cpu,
    color: "from-zinc-600 to-zinc-800",
  },
  {
    name: "Ruang Broadcast",
    icon: Camera,
    color: "from-zinc-500 to-zinc-700",
  },
];

interface CartItem extends Alat {
  tipe_item: "alat" | "bahan";
  selected_tags: string[];
  qty: number;
  nama_bahan?: string;
  letak_id?: any;
}

export default function PengajuanPinjamAlatPage() {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [alatList, setAlatList] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFormStep, setIsFormStep] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // 🌟 Gunakan ruanganLabId dan listRuangan dari API database
  const [ruanganLabId, setRuanganLabId] = useState<string>("");
  const [listRuangan, setListRuangan] = useState<any[]>([]);

  const [kodeMatkul, setKodeMatkul] = useState("");
  const [mataKuliah, setMataKuliah] = useState("");
  
  const [tujuan, setTujuan] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [captchaString, setCaptchaString] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // 🌟 Ambil data 6 ruangan lab dari database saat komponen dimuat
  useEffect(() => {
    api.get("/ruangan-labs")
      .then((res) => {
        setListRuangan(res.data?.data || res.data || []);
      })
      .catch((err) => console.error("Gagal memuat ruangan lab:", err));
  }, []);

  const alatSiapPinjam = useMemo(() => {
    const list = Array.isArray(alatList) ? alatList : []; 
    return list.filter((item: any) => {
      if (item.tipe_item === "bahan") return true;
      const kondisi = (item?.kondisi || "").toLowerCase().trim();
      return kondisi === "baik" || kondisi === "";
    });
  }, [alatList]);

  const generateCaptcha = useCallback(() => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaString(result);
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    if (isFormStep) generateCaptcha();
  }, [isFormStep, generateCaptcha]);

  const handleSelectGroup = async (name: string) => {
    setSelectedGroup(name);
    try {
      setLoading(true);
      
      let dataAlat: any[] = [];
      let dataBahan: any[] = [];

      try {
        const params: any = { role: "mahasiswa", lab: name };
        if (startTime) params.waktu_mulai = startTime;
        if (endTime) params.waktu_selesai = endTime;

        const resAlat = await api.get(`/alat`, { params });
        const rawAlat = resAlat.data;
        dataAlat = (Array.isArray(rawAlat) ? rawAlat : (rawAlat?.data || [])).map((item: any) => ({
          ...item,
          tipe_item: "alat",
        }));
      } catch (e) {
        console.error("Gagal ambil alat:", e);
      }

      try {
        const resBahan = await api.get(`/bahans?lab=${name}`);
        const rawBahan = resBahan.data;
        dataBahan = (Array.isArray(rawBahan) ? rawBahan : (rawBahan?.data || [])).map((item: any) => ({
          ...item,
          tipe_item: "bahan",
          nama_alat: item.nama_bahan,
        }));
      } catch (e) {
        console.error("Gagal ambil bahan:", e);
      }

      setAlatList([...dataAlat, ...dataBahan]);
    } catch (err) {
      console.error("Gagal memuat katalog:", err);
      setAlatList([]);
    } finally {
      setLoading(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImagePreview(imageSrc);
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          setImageFile(new File([blob], "alat.jpg", { type: "image/jpeg" }));
          setShowCamera(false);
        });
    }
  }, []);

  const addToCart = (item: any, tipe: "alat" | "bahan" = "alat") => {
    if (cart.find((i) => i.id === item.id && i.tipe_item === tipe)) return;
    
    const baseTag = item.kode_tag ? item.kode_tag.trim() : "";
    const finalTagList = item.kode_tag_list && item.kode_tag_list.length > 0 
      ? item.kode_tag_list 
      : (baseTag ? [baseTag] : []);

    setCart([
      ...cart, 
      { 
        ...item, 
        tipe_item: tipe,
        qty: 1, 
        kode_tag_list: finalTagList, 
        selected_tags: finalTagList 
      }
    ]);
  };

  const handleCheckout = async () => {
    const isBooking = startTime !== "";

    if (!isFormStep) {
      const assetTanpaTag = cart.find((item) => {
        if (item.tipe_item === "alat" && (item.is_aset === true || item.is_aset === "1")) {
          return (
            !item.selected_tags ||
            item.selected_tags.length === 0 ||
            item.selected_tags.some((tag) => !tag || tag.trim() === "")
          );
        }
        return false;
      });

      if (assetTanpaTag) {
        return Swal.fire({
          title: "Kode Unit Diperlukan",
          text: `Alat "${assetTanpaTag.nama_alat}" wajib diisi unitnya.`,
          icon: "warning",
        });
      }
      setIsFormStep(true);
      return;
    }

    if (!ruanganLabId)
      return Swal.fire("Form Kosong", "Silakan tentukan ruangan lab tujuan.", "warning");
    if (!kodeMatkul || !mataKuliah)
      return Swal.fire("Form Kosong", "Silakan pilih mata kuliah.", "warning");
    if (!tujuan.trim())
      return Swal.fire("Form Kosong", "Tujuan penggunaan wajib diisi.", "warning");
    if (captchaInput.toUpperCase() !== captchaString)
      return Swal.fire("Validasi Gagal", "Kode Captcha salah.", "error");

    if (!isBooking && !imageFile) {
      return Swal.fire(
        "Foto Diperlukan",
        "Foto kondisi fisik alat wajib dilampirkan untuk peminjaman langsung.",
        "warning"
      );
    }

    if (isBooking && startTime) {
      const selectedStart = new Date(startTime).getTime();
      const nowTime = new Date().getTime();

      if (selectedStart < nowTime) {
        return Swal.fire(
          "Waktu Tidak Valid",
          "Waktu mulai pemesanan tidak boleh kurang dari waktu saat ini.",
          "warning"
        );
      }
    }

    if (isBooking && startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return Swal.fire(
        "Waktu Tidak Valid",
        "Jam selesai harus setelah jam mulai pemesanan.",
        "warning"
      );
    }

    const formData = new FormData();
    
    // 🌟 Kirim ruangan_lab_id (berupa ID angka dari tabel ruangan_labs)
    formData.append("ruangan_lab_id", ruanganLabId);
    formData.append("kode_matkul", kodeMatkul);
    formData.append("mata_kuliah", mataKuliah);
    formData.append("tujuan", tujuan);
    formData.append("jenis_peminjaman", isBooking ? 'pesanan' : 'langsung');
    
    if (imageFile) {
      formData.append("foto_before", imageFile);
    }
    
    if (isBooking) {
      formData.append("waktu_mulai", startTime);
      formData.append("waktu_selesai", endTime);
    }

    const itemsPayload = cart.map((i) => ({
      item_id: parseInt(String(i.id), 10),
      tipe_item: i.tipe_item || "alat",
      qty: i.tipe_item === "bahan" ? (parseInt(String(i.qty), 10) || 1) : (i.selected_tags?.length || 1),
      kode_tag_list: i.tipe_item === "alat" ? (i.selected_tags || []) : [],
    }));

    formData.append("items", JSON.stringify(itemsPayload));

    try {
      setLoading(true);
      const response = await api.post("/peminjaman/ajukan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire(
          "Pengajuan Sukses",
          isBooking 
            ? "Pesanan berhasil diajukan, menunggu persetujuan koordinator."
            : "Peminjaman langsung berhasil, alat/bahan siap digunakan.",
          "success"
        );
        setCart([]);
        setIsCartOpen(false);
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Error response:", err.response?.data);
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kendala pada server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(alatSiapPinjam.length / itemsPerPage) || 1;

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return getColumns(cart, (item: any) => addToCart(item, item.tipe_item || "alat"));
  }, [cart]);

  const table = useReactTable({
    data: alatSiapPinjam,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <PageLayout
      pageTitle="Katalog Alat & Bahan Laboratorium"
      pageDescription="Pilih kluster gedung, tentukan perangkat atau bahan praktikum, dan isi formulir pemesanan."
    >
      <div className="py-6 w-full space-y-10 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 text-left">
        {!selectedGroup ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-full px-1 sm:px-0 ">
            {LAB_GROUPS.map((lab) => (
              <LabGroupCard
                key={lab.name}
                {...lab}
                onClick={() => handleSelectGroup(lab.name)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 w-full ">
            <div className="flex items-center justify-between">
              <Button variant="brutal" onClick={() => setSelectedGroup(null)}>
                <ArrowLeft className="mr-1.5 w-4 h-4" /> Kembali ke Katalog Utama
              </Button>
              {selectedGroup && (
                <Input
                  placeholder="Cari nama alat/bahan laboratorium..."
                  className="max-w-xs h-11 bg-white dark:bg-zinc-950 font-medium text-xs border border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              )}
            </div>
            <InventoryTable table={table} loading={loading} columnsCount={3} />
            <div className="w-full flex justify-center pt-2">
              <LoanPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <Button
            onClick={() => {
              setIsCartOpen(true);
              setIsFormStep(false);
            }}
            variant={"brutal"}
            className="fixed bottom-8 right-8 h-16 px-4 z-40 group shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none rounded-none"
          >
            <div className="relative bg-white/10 dark:bg-black/10 p-2">
              <ShoppingCart size={16} />
              <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 dark:bg-zinc-50 border border-white dark:border-zinc-900 text-[9px] w-5 h-5 flex items-center justify-center font-mono font-black text-white dark:text-zinc-900 shadow-sm">
                {cart.length}
              </span>
            </div>
          </Button>
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={setIsCartOpen}
          isFormStep={isFormStep}
          cartCount={cart.length}
          onNext={handleCheckout}
          loading={loading}
        >
          {!isFormStep ? (
            <CartItemList
              cart={cart as any}
              onRemove={(id: number, tipeItem: string) => 
                setCart(cart.filter((c) => !(c.id === id && c.tipe_item === tipeItem)))
              }
              onUpdateTags={(id, newTags) =>
                setCart(
                  cart.map((c) =>
                    c.id === id ? { ...c, selected_tags: newTags } : c,
                  ),
                )
              }
              onUpdateQty={(id, newQty) =>
                setCart(
                  cart.map((c) => (c.id === id ? { ...c, qty: newQty } : c)),
                )
              }
            />
          ) : (
            <CheckoutFormStep
              // 🌟 Kirim props ruangan berbasis ID dari API database
              targetRoom={ruanganLabId}
              setTargetRoom={setRuanganLabId}
              kodeMatkul={kodeMatkul}
              setKodeMatkul={setKodeMatkul}
              mataKuliah={mataKuliah}
              setMataKuliah={setMataKuliah}
              tujuan={tujuan}
              setTujuan={setTujuan}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
              imagePreview={imagePreview}
              webcamRef={webcamRef}
              onCapture={capture}
              captchaString={captchaString}
              captchaInput={captchaInput}
              setCaptchaInput={setCaptchaInput}
              onRefreshCaptcha={generateCaptcha}
              rooms={listRuangan} // 🌟 Data ruangan kini berasal dari database (6 ID ruangan)
            />
          )}
        </CartDrawer>
      </div>
    </PageLayout>
  );
}