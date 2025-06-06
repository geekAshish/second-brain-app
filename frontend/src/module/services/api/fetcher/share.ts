import { Client } from "../../api.client";

export const shareBrainFetcher = () => {
  return Client.post("/api/v1/content/share-brain", { share: true });
};

export const getShareBrainFetcher = (brainId: string) => {
  return Client.get(`/api/v1/content/${brainId}`);
};

export const getShareBrainContentFetcher = (brainId: string) => {
  return Client.get(`/api/v1/content/share-content/${brainId}`);
};
