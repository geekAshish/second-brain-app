import axios from "axios";
import { BACKEND_URL } from "../../../../config";

export const shareBrainFetcher = async () => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/content/share-brain`,
    {
      share: true,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

  const shareUrl = response.data.hash;

  return shareUrl;
};
