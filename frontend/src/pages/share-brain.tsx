import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";

import { Link, useParams, useSearchParams } from "react-router-dom";
import { useShareContent } from "../hooks/useShareContent";

export function ShareBrain() {
  const [param] = useSearchParams();
  const type = param.get("type");
  const { brainId } = useParams();

  const { contents, error } = useShareContent({ brainId, type });

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <p>{error}</p>

        <Link
          to={"/dashboard"}
          className="border bg-purple-300 px-5 py-2 rounded my-5"
        >
          Home
        </Link>
      </div>
    );
  }

  if (contents?.length > 0) {
    return (
      <div>
        <Sidebar />
        <div className="p-4 ml-52 min-h-screen bg-gray-100 border-2">
          <div className="columns-1 sm:columns-2 gap-4 mt-10">
            {contents?.map(
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
                contentId={contents?.contentId?._id}
                type={contents?.contentId?.type}
                link={contents?.contentId?.link}
                title={contents?.contentId?.title}
                description={contents?.contentId?.description}
                createdAt={contents?.contentId?.createdAt}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
