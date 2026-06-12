import { MyInputForm } from "../../molecules/Form";
import { MyButton, MyButtonIcon } from "../../atoms/Button";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export function FormRegister() {
  return (
    <form action="" className="flex flex-col gap-6">
      <MyInputForm
        label="Email"
        type="email"
        placeholder="youreamail@example.com"
      />
      <MyInputForm label="Username" type="text" placeholder="your username" />
      <MyInputForm label="Password" type="password" placeholder="password" />
      <div className="flex flex-col gap-4">
        <MyButton titleButton="Login" size="lg" />
        <MyButtonIcon
          titleButton="Masuk dengan email Polines"
          icon={faGoogle}
          size="lg"
          variant="outline"
        />
      </div>
    </form>
  );
}
