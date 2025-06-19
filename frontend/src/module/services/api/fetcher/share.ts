import { Client } from "../../api.client";

interface SharePayload {
  brainId?: string;
  contentId?: string;
}

export const shareBrainFetcher = (payload: SharePayload) => {
  return Client.post("/api/v1/share", payload);
};

export const getShareBrainFetcher = (shareId: string) => {
  return Client.get(`/api/v1/share/${shareId}`);
};
