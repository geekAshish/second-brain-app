import { Client } from "../../api.client";

export const brainFetcher = ({
  tag,
  page,
  size,
}: {
  tag: string;
  page: number;
  size: number;
}) => {
  return Client.get(
    `/api/v1/content${tag ? `?tag=${tag}&` : "?"}page=${page}&size=${size}`
  );
};

export const createBrainFetcher = (payload: any) => {
  return Client.post(`/api/v1/content`, payload);
};

export const updateBrainFetcher = (payload: any) => {
  return Client.put(`/api/v1/content`, payload);
};
