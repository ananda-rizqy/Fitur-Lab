import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { MySidebar } from "../../components/organism/Sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import api from "../../services/api";
import Swal from "sweetalert2";

export function AppLayout() {
  
  const notifiedSet = useRef<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("notified_loans") || "[]"))
  );

  const markAsNotified = (key: string) => {
    notifiedSet.current.add(key);
    localStorage.setItem("notified_loans", JSON.stringify(Array.from(notifiedSet.current)));
  };

  // 🌟 Pengecekan Notifikasi Global di Layout Utama
  useEffect(() => {

    const checkActiveLoans = async () => {
      try {
        const res = await api.get("/mahasiswa/riwayat-saya");
        const responseData = Array.isArray(res.data) ? res.data : res.data.data || [];

        const now = new Date().getTime();

        responseData.forEach((item: any) => {
          const sId = Number(item.status_id);
          const sText = (item.status || "").toLowerCase().trim();
          
          // 1. Deteksi status baru disetujui (ACC Tendik)
          const isApproved = sId === 2 || sText === "disetujui" || sText === "approved" || sText === "dipesan";
          const approvedKey = `${item.id}-approved`;
          
          if (isApproved && !notifiedSet.current.has(approvedKey)) {
            markAsNotified(approvedKey);
            
            Swal.fire({
              title: "PEMINJAMAN DISETUJUI!",
              text: `Pengajuan peminjaman untuk tujuan "${item.tujuan || 'praktikum'}" telah disetujui. Silakan ambil alat sesuai jadwal.`,
              icon: "success",
              confirmButtonColor: "#000000",
              customClass: {
                popup: "rounded-none border-4 border-zinc-950 font-mono",
                title: "font-black uppercase tracking-wide text-zinc-900 text-sm",
                confirmButton: "rounded-none font-mono font-black text-xs uppercase tracking-wider bg-black text-white px-5 py-2.5"
              }
            });
          }

          // 2. Deteksi status "Menunggu Pengecekan" / Verifikasi Pengembalian
          const isWaitingCheck = sId === 6 || sText === "menunggu_pengecekan" || sText === "menunggu verifikasi";
          const checkKey = `${item.id}-check`;
          
          if (isWaitingCheck && !notifiedSet.current.has(checkKey)) {
            markAsNotified(checkKey);
            
            Swal.fire({
              title: "STATUS PENGEMBALIAN",
              text: `Alat yang Anda kembalikan sedang dalam status "Menunggu Pengecekan" oleh petugas laboratorium.`,
              icon: "info",
              confirmButtonColor: "#000000",
              customClass: {
                popup: "rounded-none border-4 border-zinc-950 font-mono",
                title: "font-black uppercase tracking-wide text-zinc-900 text-sm",
                confirmButton: "rounded-none font-mono font-black text-xs uppercase tracking-wider bg-black text-white px-5 py-2.5"
              }
            });
          }

          // 3. Deteksi status "Selesai"
          const isCompleted = sId === 4 || sText === "selesai";
          const completeKey = `${item.id}-complete`;

          if (isCompleted && !notifiedSet.current.has(completeKey)) {
            markAsNotified(completeKey);

            Swal.fire({
              title: "PENGEMBALIAN SELESAI!",
              text: `Pengecekan pengembalian alat untuk tujuan "${item.tujuan || 'praktikum'}" telah disetujui oleh tendik. Terima kasih telah menjaga kondisi alat lab!`,
              icon: "success",
              confirmButtonColor: "#000000",
              customClass: {
                popup: "rounded-none border-4 border-zinc-950 font-mono",
                title: "font-black uppercase tracking-wide text-zinc-900 text-sm",
                confirmButton: "rounded-none font-mono font-black text-xs uppercase tracking-wider bg-black text-white px-5 py-2.5"
              }
            });
          }

          // 4. Deteksi status sedang berlangsung untuk Peringatan Waktu
          const isOngoing = sId === 5 || sText === "berlangsung" || sText === "ongoing";

          if (isOngoing && item.waktu_selesai) {
            const waktuSelesai = new Date(item.waktu_selesai).getTime();
            const selisihMenit = (waktuSelesai - now) / (1000 * 60);
            
            // 🌟 Deklarasi Key untuk logika waktu
            const warningKey = `${item.id}-warning`;
            const overdueKey = `${item.id}-overdue`;

            // A. Peringatan sisa waktu 15 menit atau kurang
            if (selisihMenit > 0 && selisihMenit <= 15 && !notifiedSet.current.has(warningKey)) {
              markAsNotified(warningKey);
              
              Swal.fire({
                title: "PERINGATAN WAKTU PEMINJAMAN!",
                text: `Waktu peminjaman alat Anda akan segera habis dalam waktu sekitar ${Math.round(selisihMenit)} menit lagi. Harap bersiap untuk mengembalikan alat ke laboratorium.`,
                icon: "warning",
                confirmButtonColor: "#000000",
                customClass: {
                  popup: "rounded-none border-4 border-zinc-950 font-mono",
                  title: "font-black uppercase tracking-wide text-zinc-900 text-sm",
                  confirmButton: "rounded-none font-mono font-black text-xs uppercase tracking-wider bg-black text-white px-5 py-2.5"
                }
              });
            }
            // B. Peringatan waktu sudah terlewat (Overdue)
            else if (selisihMenit <= 0 && !notifiedSet.current.has(overdueKey)) {
              markAsNotified(overdueKey);

              Swal.fire({
                title: "WAKTU PEMINJAMAN HABIS!",
                text: `Waktu estimasi peminjaman alat sudah terlewat! Segera lakukan proses pengembalian di sistem dan kembalikan fisik alat kepada Tendik.`,
                icon: "error",
                confirmButtonColor: "#b91c1c", // Merah
                customClass: {
                  popup: "rounded-none border-4 border-red-700 font-mono bg-red-50",
                  title: "font-black uppercase tracking-wide text-red-700 text-sm",
                  confirmButton: "rounded-none font-mono font-black text-xs uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white px-5 py-2.5"
                }
              });
            }
          }
        });
      } catch (err) {
        // Abaikan error jaringan jika API gagal di-fetch di background
      }
    };

    checkActiveLoans();
    const interval = setInterval(checkActiveLoans, 60000); // Cek setiap 1 menit

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <MySidebar />
      <main className="w-full">
        <SidebarTrigger className="fixed top-2 ml-5" />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}