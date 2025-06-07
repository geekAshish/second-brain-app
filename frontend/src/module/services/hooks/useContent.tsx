import { useMutation, useQuery } from "@tanstack/react-query";
import {
  brainFetcher,
  createBrainFetcher,
  updateBrainFetcher,
} from "../api/fetcher/brain";

export function useContent({ tag }) {
  const { data, refetch, isSuccess, isError, error, isLoading } = useQuery({
    queryKey: ["brain-content", tag],
    queryFn: () => brainFetcher(tag),
  });

  return {
    data: data?.data?.data,
    refetch,
    isSuccess,
    isError,
    error,
    isLoading,
  };
}

export function useCreateContent() {
  const { data, mutate, isSuccess, isError, error, isPending } = useMutation({
    mutationFn: createBrainFetcher,
  });

  return {
    data: data?.data,
    mutate,
    isSuccess,
    isError,
    error,
    isPending,
  };
}

export function useUpdateContent() {
  const { data, mutate, isSuccess, isError, error, isPending } = useMutation({
    mutationFn: updateBrainFetcher,
  });

  return {
    data: data?.data,
    mutate,
    isSuccess,
    isError,
    error,
    isPending,
  };
}
