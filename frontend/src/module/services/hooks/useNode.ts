import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNodeFetcher,
  getChildrenNodeFetcher,
  getDeleteNodeFetcher,
  getNodeFetcher,
  getRootNodeFetcher,
  getUpdateNodeFetcher,
} from "../api/fetcher/nodefile";

export function useGetNode({ parentId }: { parentId: string }) {
  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ["get-node", parentId],
    queryFn: () => getNodeFetcher({ parentId }),
  });

  return { data: data?.data, refetch, isError, isLoading };
}

export function useGetRootNode() {
  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ["get-root-node"],
    queryFn: () => getRootNodeFetcher(),
  });

  return { data: data?.data, refetch, isError, isLoading };
}

export function useGetChildrenNode(parentId: string) {
  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ["get-children-node", parentId],
    queryFn: () => getChildrenNodeFetcher(parentId),
    enabled: parentId?.length > 0 ? true : false,
  });

  return { data: data?.data, refetch, isError, isLoading };
}

export const useCreateNode = () => {
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: createNodeFetcher,
  });

  return { data: data?.data, mutate, isPending, isError, error };
};

export const useUpdateNode = () => {
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: getUpdateNodeFetcher,
  });

  return { data: data?.data, mutate, isPending, isError, error };
};

export const useDeleteNode = () => {
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: getDeleteNodeFetcher,
  });

  return { data: data?.data, mutate, isPending, isError, error };
};
