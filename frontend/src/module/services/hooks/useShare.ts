import { useMutation, useQuery } from "@tanstack/react-query";
import { getShareBrainFetcher, shareBrainFetcher } from "../api/fetcher/share";

export const useGetUpdateShareBrainStatusFetcher = () => {
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: shareBrainFetcher,
  });

  return { data: data?.data, mutate, isPending, isError, error };
};

export const useGetShareBrainFetcher = (shareId) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-share-brain", shareId],
    queryFn: () => getShareBrainFetcher(shareId),
  });

  return {
    data: data?.data?.shared,
    isLoading,
    isError,
    error,
  };
};
