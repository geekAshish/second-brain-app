import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getShareBrainContentFetcher,
  getShareBrainFetcher,
  shareBrainFetcher,
} from "../api/fetcher/share";

export const useGetUpdateShareBrainStatusFetcher = () => {
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: shareBrainFetcher,
  });

  return { data: data?.data, mutate, isPending, isError, error };
};

export const useGetShareBrainFetcher = (brainId: string, type: string) => {
  const isEnabled = brainId && type === "brain" ? true : false;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-share-brain", brainId],
    queryFn: () => getShareBrainFetcher(brainId),
    enabled: isEnabled,
  });

  return { data: data?.data?.content, isLoading, isError, error };
};

export const useGetShareBrainContentFetcher = (
  brainId: string,
  type: string
) => {
  const isEnabled = brainId && type === "content" ? true : false;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-share-brain-content", brainId],
    queryFn: () => getShareBrainContentFetcher(brainId),
    enabled: isEnabled,
  });

  return { data: data?.data?.content, isLoading, isError, error };
};
