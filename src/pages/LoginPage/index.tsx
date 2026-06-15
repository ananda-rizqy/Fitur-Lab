import { useState, useCallback, useEffect } from "react";
import { AuthLayout } from "../../layouts/AuthForm";
import { FormLogin } from "../../components/organism/FormLogin";
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";
 
export function LoginPage() {
  const [captchaString, setCaptchaString] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = useCallback(() => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaString(result);
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  return (
  <div className="flex items-center justify-center min-h-screen w-full overflow-hidden p-4">
    <AuthLayout
      titleCard="Login to your account"
      descriptionContent="Enter your credentials below to login to your account"
    >
      <div className="flex flex-col gap-6">

        <FormLogin
          captchaInput={captchaInput}
          setCaptchaInput={setCaptchaInput}
          captchaString={captchaString}
        />

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-zinc-500">
            Verifikasi Keamanan
          </label>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-100 border-2 border-zinc-950 px-6 py-2 font-mono font-black tracking-[0.3em] select-none text-xl w-full text-center">
              {captchaString}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={generateCaptcha}
            >
              <RefreshCw size={16} />
            </Button>
          </div>

          <input
            type="text"
            placeholder="MASUKKAN KODE DI ATAS"
            className="w-full border-2 border-zinc-950 p-2 font-mono text-sm uppercase"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
        </div>
        <Button
  type="submit"
  form="loginForm"
  variant="brutal"
  className="w-full py-6 bg-blue-700 text-white"
>
  Masuk Sekarang
</Button>

      </div>
    </AuthLayout>
  </div>
);
}