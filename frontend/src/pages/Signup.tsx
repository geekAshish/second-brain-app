import { useRef } from "react";

import { ToastContainer } from "react-toastify";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/module/context/AuthContext";

export default function Signup() {
  const { login } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signup() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    login({ username, email, password });
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
