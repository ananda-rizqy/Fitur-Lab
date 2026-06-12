import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Simpan token ke localStorage
      localStorage.setItem("token", token);

      // 2. Kasih jeda dikit biar storage beneran keisi, lalu pindah
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      // Kalau gak ada token, balik ke login
      navigate("/login?error=Token tidak ditemukan");
    }
  }, [searchParams, navigate]);

  return <div>Loading... Tunggu sebentar ya!</div>;
}
