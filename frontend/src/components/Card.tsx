import { useState } from "react";
import { Edit, Share, Twitter, Youtube } from "lucide-react";

import { Modal } from "./ui/Modal";
import { UpdateContentModal } from "./UpdateContentModal";
import { useLocation } from "react-router-dom";

interface CardProps {
  title: string;
  link: string;
  // type: "twitter" | "youtube";
  description: string;
  contentId?: string;
  shareUrlData?: any;
  type: string;
  createdAt?: Date;
  refresh?: () => void;
  refreshTags?: () => void;
  handleShareBrain?: (b: { brainId?: string; contentId?: string }) => void;
}

function getYouTubeVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const getYoutubeLink = (link: string) => {
  const ytId = getYouTubeVideoId(link);

  const finalLink = `https://www.youtube.com/embed/${ytId}`;

  return finalLink;
};

export function Card({
  title,
  contentId,
  link,
  type,
  description,
  createdAt,
  refresh = () => {},
  refreshTags = () => {},
  shareUrlData,
  handleShareBrain,
}: CardProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [modalOpen, setModalOpen] = useState(false);
  const [openShareBrainModal, setOpenShareBrainModal] = useState(false);

  const date = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = date.toLocaleString("en-GB", { timeZone: "UTC" });

  return (
    <div>
      <UpdateContentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        title={title}
        contentId={contentId}
        link={link}
        description={description}
        refresh={refresh}
        refreshTags={refreshTags}
      />

      <Modal
        open={openShareBrainModal}
        onClose={() => setOpenShareBrainModal(false)}
      >
        <div>
          <p>http://localhost:5173/share-brain/{shareUrlData?.shareHash}</p>
        </div>
      </Modal>

      <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
        {/* {contentId && pathname?.includes("dashboard") && (
          <div className="flex justify-end items-end">
            <label className="inline-flex items-center justify-end cursor-pointer">
              <span className="mr-1 text-sm font-medium text-gray-900 dark:text-gray-500">
                Share with others
              </span>

              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={shareToOtherHandler}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500 dark:peer-checked:bg-purple-600"></div>
            </label>
          </div>
        )} */}

        <div className="flex justify-between">
          <div className="flex items-center text-md">
            <div className="text-gray-500 pr-2">
              {type === "youtube" && <Youtube />}
              {type === "twitter" && <Twitter />}
            </div>
            {title}
          </div>

          <div className="flex items-center">
            <div className="p-2 text-gray-500 cursor-pointer">
              {contentId && pathname?.includes("dashboard") && (
                <div
                  onClick={() => {
                    handleShareBrain?.({ contentId: contentId });
                    setOpenShareBrainModal(true);
                  }}
                >
                  <Share size={17} />
                </div>
              )}
            </div>
            {!location.pathname?.includes("share-brain") && (
              <div className="p-2 text-gray-500 cursor-pointer hover:bg-slate-200 rounded">
                <Edit size={17} onClick={() => setModalOpen(true)} />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          {type === "youtube" && (
            <iframe
              className="w-full"
              src={getYoutubeLink(link)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {type === "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}
        </div>
        <div>
          <p className="text-[10px] mt-5">{formattedDate}</p>
          <p className="text-[10px] mt-5">{description}</p>
        </div>
      </div>
    </div>
  );
}
