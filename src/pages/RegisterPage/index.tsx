import { AuthLayout } from "../../layouts/AuthForm";
import { FormRegister } from "../../components/organism/FormRegister";
import { Link } from "react-router-dom";
export function RegisterPage() {
  return (
    <AuthLayout
      titleCard="SignUp"
      descriptionContent="Enter your email below to create your account"
    >
      <div className="flex flex-col gap-2">
        <FormRegister />
        <Link to="/">
          <p className="text-primary">
            Already have account? <a>Sign In</a>
          </p>
        </Link>
      </div>
    </AuthLayout>
  );
}
