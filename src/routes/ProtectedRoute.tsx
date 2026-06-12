import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/mahasiswa");
        setIsAuth(true);

        const role = (response.data.role || "user").toLowerCase().trim();
        setUserRole(role);

        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error: any) {
        console.error("Auth Error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuth(false);
        } else {
          const backupUser = JSON.parse(localStorage.getItem("user") || "{}");
          const backupRole = (backupUser?.role || "user").toLowerCase().trim();

          setIsAuth(true);
          setUserRole(backupRole);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    // Bisa kamu ganti dengan komponen spinner loading minimalis monokrom agar UX lebih mulus
    return (
      <div className="fixed inset-0 bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/" replace />;

  // 🔥 PENYEMPURNAAN 3: Normalisasi array allowedRoles ke huruf kecil sebelum pengecekan (.includes)
  if (allowedRoles && userRole) {
    const normalizedAllowedRoles = allowedRoles.map((r) =>
      r.toLowerCase().trim(),
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
}
