import { useMutation } from "@tanstack/react-query";
import { signinFetcher, signupFetcher } from "../../api/fetcher/auth";

export const useSignin = () => {
  const { data, isSuccess, isError, error, isPending, mutate } = useMutation({
    mutationFn: signinFetcher,
  });

  return { data, isSuccess, isError, error, isPending, mutate };
};

export const useSignup = () => {
  const { data, isSuccess, isError, error, isPending, mutate } = useMutation({
    mutationFn: signupFetcher,
  });

  return { data, isSuccess, isError, error, isPending, mutate };
};

export const useSignout = () => {};
