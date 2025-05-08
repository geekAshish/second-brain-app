import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

const getUrl = (type: string | undefined | null): string => {
  let url = "";
  if (type === "content") {
    url = `${BACKEND_URL}/api/v1/content/`;
  }
  if (type === "brain") {
    url = `${BACKEND_URL}/api/v1/content/share-content/`;
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

  const url = getUrl(type);

  function refresh() {
    axios
      .get(`${url}${brainId}`, {
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
