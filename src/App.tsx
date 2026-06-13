import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MapLabPage } from "./pages/MapPage";
import { Dashboard } from "./pages/DashboardPage";
import { SettingPage } from "./pages/SettingPage";
import { DevicePage } from "./pages/DevicePage";
import { AppLayout } from "./layouts/AppLayout/layouts";
import { HistoryPage } from "./pages/HistoryPage";
import { AlatTable } from "./pages/ManajemenPage/ManajemenInventoryPage";
import { AuthSuccess } from "./components/organism/FormLogin/AuthSuccess";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProtectedNotFoundPage } from "./routes/ProtectedNotFoundPage";
 
import { RiwayatPeminjamanAlat } from "./pages/Staff/RiwayatPeminjamanAlat/RiwayatPeminjamanAlat";
import { RiwayatPeminjamanRuangPage } from "./pages/Staff/RiwayatPeminjamanRuang/RiwayatPeminjamanRuangPage";
import { LaporanKerusakanPage } from "./pages/Staff/LaporanKerusakan/LaporanKerusakanPage";
import { PersetujuanPinjamPage } from "./pages/Staff/PersetujuanPinjam/PersetujuanPinjamPage";
import { KetersediaanAlatPage } from "./pages/Staff/KetersediaanAlat/KetersediaanAlatPage";
import PeminjamanPage from "./pages/Mahasiswa/Peminjaman/PeminjamanPage";
import { PenggunaanRuangLabPage } from "./pages/Mahasiswa/PenggunaanRuangLab/PenggunaanRuangLabPage";
import { RiwayatPeminjamanAlatPage } from "./pages/Mahasiswa/Riwayat Peminjaman Alat/RiwayatPeminjamanAlatPage";
import { RiwayatPenggunaanRuangPage } from "./pages/Mahasiswa/Riwayat Penggunaan Ruang/RiwayatPenggunaanRuangPage";
import PengajuanPeminjamanPage from "./pages/Mahasiswa/Pengajuan Pinjam Alat/PengajuanPinjamAlatPage";
import PengembalianAlatPage from "./pages/Mahasiswa/Pengembalian/PengembalianAlatPage";
import { PemantauanRuangPage } from "./pages/Dosen/PemantauanRuang/PemantauanRuangPage";
import { PemantauanAlatPage } from "./pages/Dosen/PemantauanAlat/PemantauanAlatPage";
import { ClassPage } from "./pages/ClassPage/ClassPage";
import { LaporanAsetPage } from "./pages/Laporan/LaporanAsetPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route
          element={
            // <ProtectedRoute>
            <AppLayout />
            // </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapLabPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/device-management" element={<DevicePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/alat" element={<AlatTable />} />
          <Route
            path="staff/riwayat-peminjaman-alat"
            element={<RiwayatPeminjamanAlat />}
          />
          <Route
            path="/riwayat-peminjaman-ruang"
            element={<RiwayatPeminjamanRuangPage />}
          />
          <Route path="/laporan-kerusakan" element={<LaporanKerusakanPage />} />
          <Route
            path="/persetujuan-pinjam"
            element={<PersetujuanPinjamPage />}
          />
          <Route path="/ketersediaan-alat" element={<KetersediaanAlatPage />} />

          <Route path="/class" element={<ClassPage />} />

          <Route path="*" element={<ProtectedNotFoundPage />} />

          {/* mahasiswa */}
          <Route path="/peminjaman-aktif" element={<PeminjamanPage />} />
          <Route path="/pengembalian-alat" element={<PengembalianAlatPage />} />
          <Route
            path="/penggunaan-ruang-lab"
            element={<PenggunaanRuangLabPage />}
          />
          <Route
            path="/riwayat-peminjaman-alat"
            element={<RiwayatPeminjamanAlatPage />}
          />
          <Route
            path="/riwayat-penggunaan-ruang"
            element={<RiwayatPenggunaanRuangPage />}
          />
          <Route
            path="/pengajuan-pinjam-alat"
            element={<PengajuanPeminjamanPage />}
          />

          {/* Rute Dosen */}
          <Route path="/riwayat-ruang" element={<PemantauanRuangPage />} />
          <Route path="/riwayat-alat" element={<PemantauanAlatPage />} />
          <Route path="/laporan-aset" element={<LaporanAsetPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
