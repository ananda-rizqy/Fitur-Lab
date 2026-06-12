// src/types/loan.ts
export interface CartItem extends Alat {
  selected_tags: string[];
  qty: number;
}

export const RUANGAN_SPESIFIK = [
  "Laboratorium Barat 1",
  "Laboratorium Barat 2",
  "Laboratorium Timur 1",
  "Laboratorium Timur 2",
  "Laboratorium Broadcast",
  "Laboratorium Jaringan Komputer",
];

export interface Alat {
  id: number;
  nama_alat: string;
  letak: string;
  jumlah: number;
  kondisi?: string | null;
  kode_tag?: string | null;
  kode_tag_list?: string[] | null;
  is_aset?: boolean | string;
}