import { Edit } from "lucide-react";
import { ShareIcon } from "../icons/ShareIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

interface CardProps {
  title: string;
  link: string;
  // type: "twitter" | "youtube";
  description: string;
  type: any;
  createdAt?: Date;
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

export function Card({ title, link, type, description, createdAt }: CardProps) {
  const date = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = date.toLocaleString("en-GB", { timeZone: "UTC" });
  return (
    <div>
      <div className="p-4 bg-white rounded-md border-gray-200 max-w-72  border min-h-48 min-w-72">
        <div className="flex justify-between">
          <div className="flex items-center text-md">
            <div className="text-gray-500 pr-2">
              {type === "youtube" && <YoutubeIcon />}
              {type === "twitter" && <TwitterIcon />}
            </div>
            {title}
          </div>
          <div className="flex items-center">
            <div className="p-2 text-gray-500 cursor-pointer hover:bg-slate-200 rounded">
              <a href={link} target="_blank">
                <ShareIcon />
              </a>
            </div>
            <div className="p-2 text-gray-500 cursor-pointer hover:bg-slate-200 rounded">
              <Edit size={17} />
            </div>
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
