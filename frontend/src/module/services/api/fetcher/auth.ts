import axios from "axios";

import { BACKEND_URL } from "@/config";

export const signupFetcher = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const reponse = await axios.post(BACKEND_URL + "/api/v1/auth/register", {
      username,
      email,
      password,
    });

    return reponse?.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Signup failed");
  }
};

export const signinFetcher = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const reponse = await axios.post(BACKEND_URL + "/api/v1/auth/login", {
      email,
      password,
    });

    return reponse?.data;
  } catch (err: any) {
    throw new Error(err?.response?.data || "Signin failed");
  }
};
