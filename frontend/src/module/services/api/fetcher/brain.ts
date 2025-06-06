import { Client } from "../../api.client";

export const brainFetcher = (tag: string) => {
  return Client.get(`/api/v1/content${tag ? `?tag=${tag}` : ""}`);
};
