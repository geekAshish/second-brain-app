import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";

interface tagType {
  tag: string | undefined;
}

export function useContent({ tag }: tagType) {
  const [contents, setContents] = useState([]);

  let tagQuery: string | undefined;
  if (tag) {
    tagQuery = `?tag=${tag}`;
  }

  function refresh() {
    axios
      .get(`${BACKEND_URL}/api/v1/content${tagQuery || ""}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setContents(response.data.data);
      });
  }

  useEffect(() => {
    refresh();
  }, [tag]);

  return { contents, refresh };
}
