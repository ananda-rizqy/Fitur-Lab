import React, { useEffect, useState } from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import Swal from "sweetalert2";

interface HeaderProps {
  title?: string;
  description?: string;
  onLogout?: () => void;
}

interface Student {
  id: number;
  name: string;
  nim_nip: string;
  kelas?: string;
}

export function Header({ title, description, onLogout }: HeaderProps) {
  const [isDark, setIsDark] = React.useState(false);
  const [user, setUser] = useState<Student | null>(null);

  const handleLogOutClick = () => {
    Swal.fire({
      title: "KELUAR SISTEM?",
      text: "Anda harus memasukkan ulang kredensial NIM untuk mengakses kembali dasbor inventaris lab.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#18181b",
      confirmButtonText: "YA, KELUAR",
      cancelButtonText: "BATAL",
      allowOutsideClick: false,
      background: document.documentElement.classList.contains("dark")
        ? "#18181b"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#f4f4f5"
        : "#09090b",
      customClass: {
        container: "z-[99999]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (onLogout) {
          onLogout();
        } else {
          localStorage.clear();
          window.location.replace("/");
        }
      }
    });
  };

  const fetchData = React.useCallback(() => {
    const authStorage = localStorage.getItem("auth");
    if (authStorage) {
      try {
        const parsedAuth = JSON.parse(authStorage);
        if (parsedAuth && parsedAuth.user) {
          setUser(parsedAuth.user);
        }
      } catch (error) {
        console.error("Gagal melakukan parsing data auth session", error);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);
    fetchData();
  }, [fetchData]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="w-full  border-b-2 border-zinc-950 dark:border-zinc-800 h-20 px-4 lg:px-8 flex items-center justify-between transition-colors duration-200 select-none">
      {/* left section */}
      <div className="flex items-center gap-3 overflow-hidden">
        {title ? (
          <div className=" sm:block text-left overflow-hidden">
            <h2 className="font-mono font-black text-sm md:text-2xl tracking-widest text-zinc-900 dark:text-white truncate ">
              {title}
            </h2>
            {description && (
              <p className="text-md text-zinc-400 hidden md:block dark:text-zinc-500 font-bold truncate ">
                {description}
              </p>
            )}
          </div>
        ) : (
          <div className="text-left font-mono font-black tracking-tighter text-sm bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-3 py-1  border-2 border-zinc-950">
            LAB-SYS
          </div>
        )}
      </div>

      {/* right section */}
      <div className="flex items-center gap-4">
        <Button variant="brutal" size="icon" onClick={toggleTheme}>
          {isDark ? (
            <Sun size={14} className="text-amber-400" />
          ) : (
            <Moon size={14} />
          )}
        </Button>

        <div className="w-0.5 h-7 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

        <div className="flex items-center gap-4 text-left pl-1">
          <div className="hidden md:block">
            <div className="font-sans font-black text-xs tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              {user?.name || "Guest User"}
            </div>
            <div className="font-mono text-[9px] font-black text-zinc-400 dark:text-zinc-500 tracking-wider mt-0.5">
              NIM. {user?.nim_nip || "0.00.00.0.00"}
            </div>
          </div>
        </div>

        <Button
          variant="brutal"
          size="icon"
          color="red"
          onClick={handleLogOutClick}
        >
          <LogOut size={13} />
        </Button>
      </div>
    </header>
  );
}
