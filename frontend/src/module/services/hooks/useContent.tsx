import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  brainFetcher,
  createBrainFetcher,
  updateBrainFetcher,
} from "../api/fetcher/brain";

export function useContent({ tag, size }) {
  const {
    data,
    refetch,
    isSuccess,
    isError,
    error,
    isLoading,

    isFetched,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["brain-content", tag],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      brainFetcher({ tag, size, page: pageParam }),
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.data?.length ? allPages?.length + 1 : undefined;
    },
  });

  return {
    data: data,
    refetch,
    isSuccess,
    error,
    isError,
    isLoading,

    isFetched,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
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
