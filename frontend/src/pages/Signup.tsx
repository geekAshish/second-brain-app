import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { BACKEND_URL } from "@/config";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export function Signup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onSuccessNotify = () => toast("You have signed up!");
  const onErrorNotify = (msg: string) => toast(msg, { type: "error" });

  async function signup() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      const data = await axios.post(BACKEND_URL + "/api/v1/auth/register", {
        username,
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
      <div className="bg-white rounded-xl border min-w-48 p-4">
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={emailRef} placeholder="Email" />
        <Input reference={passwordRef} placeholder="Password" />
        <div className="flex justify-center p-2">
          <Button
            onClick={signup}
            loading={false}
            variant="primary"
            text="Signup"
            fullWidth={true}
          />
        </div>
      </div>

      <ToastContainer position="bottom-right" hideProgressBar={true} />
    </div>
  );
}
