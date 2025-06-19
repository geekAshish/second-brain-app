import { Card } from "@/components/Card";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetShareBrainFetcher } from "@/module/services/hooks/useShare";
import { ArrowLeft } from "lucide-react";

export default function ShareBrain() {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const { data: brainData, error } = useGetShareBrainFetcher(shareId);

  console.log(brainData);

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

  return (
    <div className="bg-gray-100 border-2 px-5">
      <div className="m-2">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => {
            navigate("/dashboard");
          }}
        />
      </div>
      <div className="columns-1 sm:columns-4 gap-4">
        {brainData?.map(
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
  );
}
