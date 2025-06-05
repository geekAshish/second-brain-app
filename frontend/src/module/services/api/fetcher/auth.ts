import axios from "axios";

import { BACKEND_URL } from "@/config";

export const signinFetcher = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const reponse = await axios.post(BACKEND_URL + "/api/v1/auth/login", {
    email,
    password,
  });

  return reponse;
};
