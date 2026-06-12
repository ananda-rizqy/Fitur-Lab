import { AuthLayout } from "../../layouts/AuthForm";
import { FormLogin } from "../../components/organism/FormLogin";

export function LoginPage() {
  return (
    <div className=" flex items-center justify-center max-w-screen h-screen overflow-hidden">
      <AuthLayout
        titleCard="Login to your account"
        descriptionContent="Enter your email below to login your account"
      >
        <div className="flex flex-col gap-2">
          <FormLogin />
        </div>
      </AuthLayout>
    </div>
  );
}
