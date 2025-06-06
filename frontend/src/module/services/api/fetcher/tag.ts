import { Client } from "../../api.client";

export const getTagFetcher = () => {
  return Client.get(`/api/v1/content/tags`);
};
