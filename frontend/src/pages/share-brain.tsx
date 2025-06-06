import { Card } from "@/components/Card";
import { Sidebar } from "@/components/Sidebar";

import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  useGetShareBrainContentFetcher,
  useGetShareBrainFetcher,
} from "@/module/services/hooks/useShare";

export function ShareBrain() {
  const [param] = useSearchParams();
  const type = param.get("type");
  const { brainId } = useParams();

  const { data: brainData } = useGetShareBrainFetcher(brainId || "");
  const { data: contentData, error } = useGetShareBrainContentFetcher(
    brainId || ""
  );

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <p>{error?.message}</p>

        <Link
          to={"/dashboard"}
          className="border bg-purple-300 px-5 py-2 rounded my-5"
        >
          Home
        </Link>
      </div>
    );
  }

  if (contentData?.length > 0) {
    return (
      <div>
        <Sidebar />
        <div className="p-4 ml-52 min-h-screen bg-gray-100 border-2">
          <div className="columns-1 sm:columns-2 gap-4 mt-10">
            {contentData?.map(
              (
                { type, link, title, description, _id, createdAt },
                index: number
              ) => (
                <div key={index} className="mb-4 break-inside-avoid">
                  <Card
                    key={index}
                    contentId={_id}
                    type={type}
                    link={link}
                    title={title}
                    description={description}
                    createdAt={createdAt}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
  if (type === "content") {
    return (
      <div>
        <Sidebar />
        <div className="p-4 ml-52 min-h-screen bg-gray-100 border-2">
          <div className="columns-1 sm:columns-2 gap-4 mt-10">
            <div className="mb-4 break-inside-avoid">
              <Card
                contentId={brainData?.contentId?._id}
                type={brainData?.contentId?.type}
                link={brainData?.contentId?.link}
                title={brainData?.contentId?.title}
                description={brainData?.contentId?.description}
                createdAt={brainData?.contentId?.createdAt}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
