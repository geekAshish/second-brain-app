import { useMutation } from "@tanstack/react-query";
import { signinFetcher } from "../../api/fetcher/auth";

export const useSignin = () => {
  const { data, isSuccess, isError, error, isPending } = useMutation({
    mutationFn: signinFetcher,
  });

  return { data, isSuccess, isError, error, isPending };
};

export const useSignup = () => {};

export const useSignout = () => {};
