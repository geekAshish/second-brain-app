import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useCreateContent } from "@/module/services/hooks/useContent";
import { onErrorNotify, onSuccessNotify } from "@/module/utils/toastNotify";

interface PropType {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  refreshTags: () => void;
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
  refresh,
  refreshTags,
}: PropType) {
  const [contentObj, setContentObj] = useState({
    contentId: "",
    title: "",
    link: "",
    description: "",
    tag: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const { data, mutate: createContentMutate } = useCreateContent();

  async function addContent() {
    const type = getTypeFromLink(contentObj?.link || "");
    createContentMutate(
      {
        link: contentObj?.link,
        title: contentObj?.title,
        type: type,
        description: contentObj?.description,
        tags: tags,
      },
      {
        onSuccess: () => {
          refresh();
          refreshTags();
          onClose();
          setContentObj({
            contentId: "",
            title: "",
            link: "",
            description: "",
            tag: "",
          });
          onSuccessNotify("Content created successfully");
        },
        onError: () => {
          onClose();
          onErrorNotify("unable to created content");
        },
      }
    );
  }

  const addTagHandler = (name: string, value: string) => {
    setContentObj((prev) => {
      return { ...prev, [name]: "" };
    });

    if (value) {
      setTags((prev) => [...prev, value]);
    }
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
                    name={"title"}
                    className="mb-2"
                  />
                  <Input
                    value={contentObj?.description}
                    onChange={changeHandler}
                    placeholder={"Description"}
                    name={"description"}
                    className="mb-2"
                  />
                  <Input
                    value={contentObj?.tag}
                    onChange={changeHandler}
                    placeholder={"Tag"}
                    name={"tag"}
                    onEnter={addTagHandler}
                  />
                  <div className="mb-2">
                    {tags?.map((t: string, i: number) => {
                      return (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-300 p-1 rounded-full mr-2"
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>

                  <Input
                    value={contentObj?.link}
                    onChange={changeHandler}
                    placeholder={"Link"}
                    name={"link"}
                    className="mb-2"
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
