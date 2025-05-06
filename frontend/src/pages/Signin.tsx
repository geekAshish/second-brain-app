import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();

  const onSuccessNotify = () => toast("You have signed in!");
  const onErrorNotify = (msg: string) => toast(msg, { type: "error" });

  async function signin() {
    const email = usernameRef.current?.value;
    console.log(usernameRef.current);
    const password = passwordRef.current?.value;

    try {
      const data = await axios.post(BACKEND_URL + "/api/v1/auth/login", {
        email,
        password,
      });
      localStorage.setItem("access_token", data?.data?.access_token);
      onSuccessNotify();

      setTimeout(() => {
        // navigate("/signin");
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      onErrorNotify(err?.response.data?.msg);
    }
  }
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input reference={usernameRef} placeholder="email" />
        <Input reference={passwordRef} placeholder="Password" />
        <div className="flex justify-center pt-4">
          <Button
            onClick={signin}
            loading={false}
            variant="primary"
            text="Signin"
            fullWidth={true}
          />
        </div>
      </div>

      <ToastContainer position="bottom-right" hideProgressBar={true} />
    </div>
  );
}
