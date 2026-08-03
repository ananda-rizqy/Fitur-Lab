import React, { useState, useEffect, useMemo } from "react";
import { ModalEditAkses } from "./ModelEditAkses"; 
import { Search } from "lucide-react";
import api from "../../services/api"; // Sesuaikan path menuju konfigurasi Axios Anda

export function ManajemenUserPage() {
  const [dataUsers, setDataUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // 🌟 State untuk filter searching dan dropdown role
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setDataUsers(response.data.data || []); 
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 🌟 Mengambil daftar role unik secara dinamis dari data user untuk dropdown filter
  const availableRoles = useMemo(() => {
    const roles = dataUsers.map((u) => u.role).filter((r) => !!r);
    return Array.from(new Set(roles));
  }, [dataUsers]);

  // 🌟 Melakukan filtering data berdasarkan Search Query dan Role yang dipilih
  const filteredUsers = useMemo(() => {
    return dataUsers.filter((user) => {
      const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesRole = selectedRole === "all" || user.role?.toLowerCase() === selectedRole.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [dataUsers, searchQuery, selectedRole]);

  return (
    <div className="p-6 font-mono">
      
      <div className="mb-8">
        <h2 className="text-xl font-black uppercase tracking-wider mb-4">Manajemen Pengguna</h2>
        
        {/* 🌟 TOOLBAR FILTER & SEARCHING */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Input Search Nama */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Cari nama pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-xs font-bold uppercase focus:outline-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]"
            />
          </div>

          {/* Dropdown Filter Role */}
          <div className="w-full sm:w-[220px]">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-xs font-bold uppercase focus:outline-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] cursor-pointer"
            >
              <option value="all">Semua Role</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LIST USERS */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-xs text-zinc-400 font-bold uppercase">
              Tidak ada pengguna yang ditemukan.
            </div>
          ) : (
            filteredUsers.map((user) => {
              // Cek apakah user berstatus mahasiswa atau tendik (akses dikunci)
              const isLocked = user.role === "mahasiswa" || user.role === "tendik";

              return (
                <div key={user.id} className="flex items-center justify-between p-4 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
                  <div>
                    <p className="font-black text-sm text-zinc-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Role: <span className="uppercase font-bold text-zinc-800 dark:text-zinc-200">{user.role}</span> 
                      {user.jabatan && ` - (${user.jabatan.toUpperCase()})`}
                    </p>
                  </div>

                  <div>
                    {isLocked ? (
                      // Jika mahasiswa atau tendik, tampilkan badge keterangan (Tombol Edit disembunyikan)
                      <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-700">
                        Akses Dikunci
                      </span>
                    ) : (
                      // Jika dosen atau admin, tampilkan tombol Edit Akses
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="bg-black hover:bg-zinc-800 text-white px-4 py-2 font-mono text-xs uppercase font-black transition-colors shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]"
                      >
                        Edit Akses
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      <ModalEditAkses 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={() => {
          fetchUsers();
        }}
      />
    </div>
  );
}