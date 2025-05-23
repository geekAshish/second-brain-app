import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface PropType {
  open: boolean;
  onClose: () => void;
  title?: string;
  contentId?: string;
  link?: string;
  description?: string;
  tag?: string;
}

const getTypeFromLink = (link: string) => {
  let type = "";
  if (link?.includes("youtu.be") || link?.includes("youtube.com")) {
    type = "youtube";
  }
  if (link?.includes("x.com") || link?.includes("twitter.com")) {
    type = "twitter";
  }

  return type;
};

// controlled component
export function CreateContentModal({
  open,
  onClose,
  title,
  link,
  contentId,
  description,
  tag,
}: PropType) {
  const [contentObj, setContentObj] = useState({
    contentId,
    title,
    link,
    description,
    tag,
  });
  const [tags, setTags] = useState<string[]>([]);

  async function addContent() {
    const type = getTypeFromLink(contentObj?.link || "");

    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        link: contentObj?.link,
        title: contentObj?.title,
        type: type,
        description: contentObj?.description,
        tag: tags,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    onClose();
  }

  const addTagHandler = (name: string, value: string) => {
    setTags((prev) => [...prev, value]);
  };

  const changeHandler = (name: string, value: string) => {
    setContentObj((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div>
      {open && (
        <div>
          <div className="fixed inset-0 bg-slate-500 opacity-60 z-40"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <div
              className="flex flex-col justify-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon />
                  </div>
                </div>
                <div>
                  <Input
                    value={contentObj?.title}
                    onChange={changeHandler}
                    placeholder={"Title"}
                    label={"title"}
                  />
                  <Input
                    value={contentObj?.description}
                    onChange={changeHandler}
                    placeholder={"Description"}
                    label={"description"}
                  />
                  <Input
                    value={contentObj?.tag}
                    onChange={changeHandler}
                    placeholder={"Tag"}
                    label={"tag"}
                    onEnter={addTagHandler}
                  />
                  <Input
                    value={contentObj?.link}
                    onChange={changeHandler}
                    placeholder={"Link"}
                    label={"link"}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={addContent}
                    variant="primary"
                    text="Submit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
