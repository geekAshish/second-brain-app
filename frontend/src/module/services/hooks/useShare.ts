import { useMutation, useQuery } from "@tanstack/react-query";
import { getShareBrainFetcher, shareBrainFetcher } from "../api/fetcher/share";

export const useGetUpdateShareBrainStatusFetcher = () => {
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: shareBrainFetcher,
  });

  return { data: data?.data, mutate, isPending, isError, error };
};

export const useGetShareBrainFetcher = (shareId) => {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["get-share-brain", shareId],
    queryFn: () => getShareBrainFetcher(shareId),
  });

  let shareData: any = [];

  if (data?.data?.shared?.type === "brain") {
    shareData = data?.data?.shared?.data?.contents;
  }
  if (data?.data?.shared?.type === "content") {
    shareData = [data?.data?.shared?.data];
  }

  return {
    data: shareData,
    isSuccess,
    isLoading,
    isError,
    error,
  };
};
