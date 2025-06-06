import { useQuery } from "@tanstack/react-query";
import { brainFetcher } from "../api/fetcher/brain";

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
