import { useState } from "react";
import { Button } from "../../ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import api from "../../../services/api";
import { Card } from "../../ui/card";
import Swal from "sweetalert2";
interface FormLoginProps {
  captchaInput: string;
  setCaptchaInput: React.Dispatch<React.SetStateAction<string>>;
  captchaString: string;
}

export function FormLogin({ captchaInput, captchaString }: FormLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Validasi CAPTCHA di dalam handleLogin
    if (captchaInput.toUpperCase() !== captchaString) {
      return setErrorMsg("Kode CAPTCHA yang Anda masukkan salah.");
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/auth/sync", { email, password });
      localStorage.setItem("auth", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);
      window.location.replace("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Koneksi ke server gagal.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="loginForm"
      onSubmit={handleLogin}
      className="space-y-6"
    >
      {/* Pesan Error */}
      {errorMsg && (
        <Card className="border-2 border-red-500 bg-red-50 text-red-600 p-4">
          <p className="font-bold text-xs">{errorMsg}</p>
        </Card>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Email 
        </label>

        <input
          type="text"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password"
            className="w-full h-12 rounded-md border border-gray-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}