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
    <form onSubmit={handleLogin} className="space-y-4">
      {errorMsg && (
        <Card className="border-2 border-red-500 bg-red-50 text-red-600 p-4 animate-in fade-in duration-200">
          <p className="font-bold text-xs">{errorMsg}</p>
        </Card>
      )}

      {/* Input Email */}
      <div className="text-left flex flex-col gap-2">
        <label className="text-sm font-medium">Email / IP Address</label>
        <input
          type="text"
          placeholder="Masukkan Email atau IP Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Input Password */}
      <div className="space-y-2 relative text-left flex flex-col">
        <label className="text-sm font-medium">Password</label>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant={"brutal"}
        className="w-full py-6 bg-blue-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Tunggu sebentar...
          </>
        ) : (
          "Masuk Sekarang"
        )}
      </Button>
    </form>
  );
}