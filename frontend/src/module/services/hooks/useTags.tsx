import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";

export function useTags() {
  const [tags, setTags] = useState([]);

  function refresh() {
    axios
      .get(`${BACKEND_URL}/api/v1/content/tags`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setTags(response.data?.data);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  return { tags, refresh };
}
