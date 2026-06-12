import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../components/themes/themes-provider";
import {
  Moon,
  Sun,
  User,
  Globe,
  Palette,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PageLayout } from "../../layouts/PageLayout";

interface UserData {
  id: number;
  name: string;
  email: string;
  nim_nip: string;
  role: string;
  kelas: string;
  prodi: string;
  jurusan: string;
  jenjang: string;
  avatar?: string;
}

export function SettingPage() {
  const { theme, setTheme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const location = useLocation();

  const checkStatus = () => {
    const authJson = localStorage.getItem("auth");
    if (authJson) {
      const authData = JSON.parse(authJson);
      setUserData(authData.user);
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [location.pathname]);

  return (
    <PageLayout
      pageTitle="Pengaturan"
      pageDescription="Kelola detail informasi akun, preferensi sistem, dan tema antarmuka Anda."
    >
      <div className="py-6 w-full space-y-10 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 text-left">
        <div className="grid gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="text-zinc-900 dark:text-zinc-100" size={18} />
              <h2 className="text-lg font-mono font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                Detail Profil
              </h2>
            </div>

            <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                  <div className="flex flex-col gap-3 items-center shrink-0">
                    <div className="relative group cursor-pointer">
                      <img
                        src={
                          userData?.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || "User"}&backgroundColor=18181b`
                        }
                        alt="Profile"
                        className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-none object-cover  transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                        <User size={13} />
                        <span className="text-sm font-mono font-black tracking-widest">
                          Nama Lengkap
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                          {userData?.name || "Memuat..."}
                        </p>
                        {userData?.role && (
                          <div className="self-start md:self-center flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100  text-xs font-mono font-black tracking-widest">
                            <ShieldCheck size={14} />
                            {userData.role.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                        <Globe size={13} />
                        <span className="text-sm font-mono font-black tracking-widest">
                          Alamat Email
                        </span>
                      </div>
                      <p className="text-sm font-mono font-bold text-zinc-700 dark:text-zinc-300 break-all">
                        {userData?.email || "memuat@mhs.polines.ac.id"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                        <span className="text-sm font-mono font-black tracking-widest">
                          Nomor Induk Mahasiswa (NIM)
                        </span>
                      </div>
                      <p className="text-sm font-mono font-bold text-zinc-700 dark:text-zinc-300">
                        {userData?.nim_nip || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {userData?.role === "mahasiswa" && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap
                  className="text-zinc-900 dark:text-zinc-100"
                  size={18}
                />
                <h2 className="text-lg font-mono font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Informasi Akademik
                </h2>
              </div>
              <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1 border-b sm:border-b-0 pb-4 sm:pb-0 border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest">
                      Kelas
                    </span>
                    <p className="text-base font-mono font-black text-zinc-900 dark:text-zinc-200">
                      {userData.kelas || "-"}
                    </p>
                  </div>
                  <div className="space-y-1 border-b sm:border-b-0 pb-4 sm:pb-0 border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest">
                      Program Studi
                    </span>
                    <p className="text-base font-mono font-black text-zinc-900 dark:text-zinc-200">
                      {userData.prodi || "-"}
                    </p>
                  </div>
                  <div className="space-y-1 border-b sm:border-b-0 pb-4 sm:pb-0 border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest">
                      Jurusan
                    </span>
                    <p className="text-base font-mono font-black text-zinc-900 dark:text-zinc-200">
                      {userData.jurusan || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-black tracking-widest">
                      Jenjang
                    </span>
                    <p className="text-base font-mono font-black text-zinc-900 dark:text-zinc-200">
                      {userData.jenjang || "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette
                  className="text-zinc-900 dark:text-zinc-100"
                  size={18}
                />
                <h2 className="text-base font-mono font-black text-zinc-900 dark:text-zinc-100">
                  Tampilan Sistem
                </h2>
              </div>
              <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans font-black text-sm text-zinc-900 dark:text-zinc-200">
                      Tema Antarmuka
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Ganti mode terang atau mode gelap sistem.
                    </p>
                  </div>
                  <Button
                    variant="brutal"
                    size="icon"
                    className="rounded-none h-10 w-10 shrink-0 bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="text-amber-500" size={18} />
                    ) : (
                      <Moon className="text-zinc-900" size={18} />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="text-zinc-900 dark:text-zinc-100" size={18} />
                <h2 className="text-base font-mono font-black text-zinc-900 dark:text-zinc-100">
                  Regional
                </h2>
              </div>
              <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans font-black text-sm text-zinc-900 dark:text-zinc-200">
                      Bahasa Utama
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Pilih bahasa operasional aplikasi.
                    </p>
                  </div>
                  <select className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono font-black text-xs border-2 border-zinc-950 dark:border-zinc-800 rounded-none px-3 py-2 outline-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none cursor-pointer min-w-[140px] h-10 uppercase tracking-wide">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (US)</option>
                    <option value="jp">Japanese</option>
                  </select>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
