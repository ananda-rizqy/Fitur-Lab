export interface Alat {
  id: number;
  nama_alat: string;
  ruang_lab: string;
  total: number;
  tersedia: number;
  kondisi: string;
}

export interface Peminjaman {
  id: number;
  alat_id: number;
  nama_mahasiswa: string;
  nim: string;
  laboratorium: string;
  tujuan_penggunaan: string;
  waktu_pinjam: string;
  waktu_kembali: string;
  status: "pending" | "disetujui" | "selesai";

  foto_before?: string | null;
  foto_after?: string | null;
  kondisi_kembali?: string | null;
  deskripsi_kerusakan?: string | null;

  alat: Alat;
}
