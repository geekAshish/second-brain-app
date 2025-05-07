import { useRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface PropType {
  open: boolean;
  onClose: () => void;
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
export function CreateContentModal({ open, onClose }: PropType) {
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const description = descriptionRef.current?.value;
    const type = getTypeFromLink(link || "");

    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        link,
        title,
        type,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    onClose();
  }

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
                  <Input reference={titleRef} placeholder={"Title"} />
                  <Input
                    reference={descriptionRef}
                    placeholder={"Description"}
                  />
                  <Input reference={linkRef} placeholder={"Link"} />
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
