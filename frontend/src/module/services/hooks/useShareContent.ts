import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";

const getUrl = (
  type: string | undefined | null,
  brainId: string | undefined
): string => {
  let url = "";
  if (type === "brain") {
    url = `${BACKEND_URL}/api/v1/content/${brainId}`;
  }
  if (type === "content") {
    url = `${BACKEND_URL}/api/v1/content/share-content/${brainId}`;
  }

  return url;
};

export function useShareContent({
  brainId,
  type,
}: {
  brainId: string | undefined;
  type: string | undefined | null;
}) {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState("");

  const url = getUrl(type, brainId);

  function refresh() {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setContents(response.data.content);
        setError("");
      })
      .catch((err) => {
        setError(err.response.data.msg);
        setContents([]);
      });
  }

  useEffect(() => {
    if (brainId) {
      refresh();
    }
  }, []);

  return { contents, error, refresh };
}
