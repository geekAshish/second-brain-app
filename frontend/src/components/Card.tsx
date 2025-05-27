import { Edit, Share, Twitter, Youtube } from "lucide-react";
import { BACKEND_URL } from "../config";

import axios from "axios";
import { useState } from "react";
import { Modal } from "./ui/Modal";
import { UpdateContentModal } from "./UpdateContentModal";

interface CardProps {
  title: string;
  link: string;
  // type: "twitter" | "youtube";
  description: string;
  contentId?: string;
  type: string;
  createdAt?: Date;
  refresh: () => void;
  refreshTags: () => void;
}

const shareBrainFetcher = async ({
  contentId,
}: {
  contentId: string | undefined;
}) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/content/share-content`,
    {
      share: true,
      contentId,
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
  refresh,
  refreshTags,
}: CardProps) {
  const [urlHash, setUrlHash] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [openShareBrainModal, setOpenShareBrainModal] = useState(false);

  const date = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = date.toLocaleString("en-GB", { timeZone: "UTC" });

  const handleShareBrain = async () => {
    const hash = await shareBrainFetcher({ contentId });
    setUrlHash(hash);
  };

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
          <p>http://localhost:5173/share-brain/{urlHash}?type=content</p>
        </div>
      </Modal>

      <div className="p-4 bg-white rounded-md border-gray-200 max-w-72  border min-h-48 min-w-72">
        <div className="flex justify-between">
          <div className="flex items-center text-md">
            <div className="text-gray-500 pr-2">
              {type === "youtube" && <Youtube />}
              {type === "twitter" && <Twitter />}
            </div>
            {title}
          </div>
          <div className="flex items-center">
            <div className="p-2 text-gray-500 cursor-pointer hover:bg-slate-200 rounded">
              <div
                onClick={() => {
                  handleShareBrain();
                  setOpenShareBrainModal(true);
                }}
              >
                <Share />
              </div>
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
