import { Client } from "../../api.client";

export const signupFetcher = ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  return Client.post("/api/v1/auth/register", {
    username,
    email,
    password,
  });
};

export const signinFetcher = ({
  password,
  email,
}: {
  password: string;
  email: string;
}) => {
  return Client.post("/api/v1/auth/login", {
    password,
    email,
  });
};
