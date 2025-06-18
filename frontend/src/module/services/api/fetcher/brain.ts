import { Client } from "../../api.client";

export const brainFetcher = ({
  tag,
  brainId,
  page,
  size,
}: {
  tag: string;
  brainId: string;
  page: number;
  size: number;
}) => {
  return Client.get(
    `/api/v1/content?brainId=${brainId}&${
      tag ? `tag=${tag}&` : ""
    }page=${page}&size=${size}`
  );
};

export const createBrainFetcher = (payload: any) => {
  return Client.post(`/api/v1/content`, payload);
};

export const updateBrainFetcher = (payload: any) => {
  return Client.put(`/api/v1/content`, payload);
};
