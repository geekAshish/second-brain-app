import { Client } from "../../api.client";

export const brainFetcher = (tag: string) => {
  return Client.post(`/api/v1/content${tag ? `?tag=${tag}` : ""}`, {
    share: true,
  });
};
