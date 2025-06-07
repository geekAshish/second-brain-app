import { Client } from "../../api.client";

export const brainFetcher = (tag: string) => {
  return Client.get(`/api/v1/content${tag ? `?tag=${tag}` : ""}`);
};

export const createBrainFetcher = (payload: any) => {
  return Client.post(`/api/v1/content`, payload);
};
