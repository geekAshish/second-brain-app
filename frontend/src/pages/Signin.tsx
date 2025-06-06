import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/module/context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Signin() {
  const { signin } = useAuth();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  async function signinHandler() {
    if (!userData?.email) return;
    if (!userData?.password) return;

    signin({
      email: userData?.email,
      password: userData?.password,
    });
  }

  const handleUserData = (name: string, value: string) => {
    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-2">
        <Input
          value={userData?.email}
          onChange={handleUserData}
          placeholder="Email"
          name="email"
          type="email"
        />
        <Input
          value={userData?.password}
          onChange={handleUserData}
          placeholder="Password"
          name="password"
          className="mt-3"
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={signinHandler}
            loading={false}
            variant="primary"
            text="Signin"
            fullWidth={true}
          />
        </div>

        <div className="text-center">
          <div className="w-full bg-gray-200 h-[1px] mt-3" />
          <NavLink to={"/signup"} className={"text-xs underline text-blue-400"}>
            Create Account
          </NavLink>
        </div>
      </div>

      <ToastContainer position="bottom-right" hideProgressBar={true} />
    </div>
  );
}
