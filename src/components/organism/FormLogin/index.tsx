import { useState } from "react";
// import { MyInputForm } from "../../molecules/Form";
import { Button } from "../../ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import api from "../../../services/api";
import { Card } from "../../ui/card";

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="text-center mb-6">
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMsg && (
          <Card className="border-2 border-red-500 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] dark:shadow-none p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 text-left">
              <div className="overflow-hidden">
                <p className="font-bold text-xs tracking-tight leading-tight">
                  {errorMsg}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="text-left flex flex-col gap-2">
  <label className="text-sm font-medium text-black dark:text-white">Email / IP Address</label>
  <input
    type="text"
    placeholder="Masukkan Email atau IP Address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
</div>

        {/* ✅ KODE BARU UNTUK PASSWORD (100% AMAN DARI NESTED FORM) */}
<div className="space-y-2 relative text-left flex flex-col">
  <label className="text-sm font-medium text-black dark:text-white">Password</label>
  <div className="relative w-full">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 dark:text-white"
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
    </div>
  );
}
