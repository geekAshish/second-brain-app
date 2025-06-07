import { useQuery } from "@tanstack/react-query";
import { getTagFetcher } from "../api/fetcher/tag";

export function useTags() {
  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ["get-tags"],
    queryFn: () => getTagFetcher(),
  });

  return { data: data?.data?.data, refetch, isError, isLoading };
}
