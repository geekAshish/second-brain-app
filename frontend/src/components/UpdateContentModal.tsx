import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useUpdateContent } from "@/module/services/hooks/useContent";
import { onSuccessNotify } from "@/module/utils/toastNotify";

interface PropType {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  refreshTags: () => void;
  title?: string;
  contentId?: string;
  link?: string;
  description?: string;
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
export function UpdateContentModal({
  open,
  onClose,
  title,
  link,
  contentId,
  description,
  refresh,
  refreshTags,
}: PropType) {
  const [contentObj, setContentObj] = useState({
    contentId,
    title,
    link,
    description,
  });

  const { data, mutate } = useUpdateContent();

  async function addContent() {
    const type = getTypeFromLink(link || "");

    mutate(
      {
        link: contentObj?.link,
        title: contentObj?.title,
        type: type,
        id: contentObj?.contentId,
        description: contentObj?.description,
      },
      {
        onSuccess: () => {
          refresh();
          refreshTags();
          onSuccessNotify("Updated successfully");
          setTimeout(() => {
            onClose();
          }, 300);
        },
        onError: () => {
          onSuccessNotify("something went wrong");
          setTimeout(() => {
            onClose();
          }, 300);
        },
      }
    );
  }

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
                    name={"title"}
                    label={"Title"}
                  />
                  <Input
                    value={contentObj?.description}
                    onChange={changeHandler}
                    placeholder={"Description"}
                    name={"description"}
                    label={"Description"}
                  />
                  <Input
                    value={contentObj?.link}
                    onChange={changeHandler}
                    placeholder={"Link"}
                    name={"link"}
                    label={"Link"}
                  />
                </div>

                <div className="flex justify-center mt-3">
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
