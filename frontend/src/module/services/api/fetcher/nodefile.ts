import { Client } from "../../api.client";

export const getNodeFetcher = ({ parentId }: { parentId: string }) => {
  return Client.get(`/api/v1/nodes${parentId ? `/${parentId}` : ""}`);
};

export const getRootNodeFetcher = () => {
  return Client.get(`/api/v1/nodes/root`);
};

export const getChildrenNodeFetcher = (parentId: string) => {
  return Client.get(`/api/v1/nodes/${parentId}`);
};

export const createNodeFetcher = (payload: any) => {
  return Client.post(`/api/v1/nodes`, payload);
};

export const getUpdateNodeFetcher = ({
  parentId,
  filename,
}: {
  parentId: string;
  filename: string;
}) => {
  return Client.put(`/api/v1/nodes/${parentId}`, { name: filename });
};

export const getDeleteNodeFetcher = (parentId: string) => {
  return Client.delete(`/api/v1/nodes/${parentId}`, {});
};
