import { useState } from "react";

import { ToastContainer } from "react-toastify";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/module/context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function signupHandler() {
    if (!userData?.username) return;
    if (!userData?.email) return;
    if (!userData?.password) return;

    signup({
      username: userData?.username,
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
          value={userData?.username}
          onChange={handleUserData}
          placeholder="Username"
          name="username"
        />
        <Input
          value={userData?.email}
          onChange={handleUserData}
          placeholder="Email"
          name="email"
          type="email"
          className="mt-3"
        />
        <Input
          value={userData?.password}
          onChange={handleUserData}
          placeholder="Password"
          name="password"
          className="mt-3"
        />
        <div className="flex justify-center p-2">
          <Button
            onClick={signupHandler}
            loading={false}
            variant="primary"
            text="Signup"
            fullWidth={true}
          />
        </div>

        <div className="text-center">
          <div className="w-full bg-gray-200 h-[1px]" />
          <NavLink to={"/signin"} className={"text-xs underline text-blue-400"}>
            Already have account?
          </NavLink>
        </div>
      </div>

      <ToastContainer position="bottom-right" hideProgressBar={true} />
    </div>
  );
}
