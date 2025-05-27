import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";

interface tags {
  count: number;
  tag: string;
  _id: string;
}

export function Sidebar({
  tags,
  selectedTagId,
  selectTagHandler,
}: {
  tags: tags[];
  selectedTagId: string;
  selectTagHandler: ({ tagId }: { tagId: string }) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="h-screen p-2 bg-white border-r w-52 fixed left-0 top-0 ">
      <div
        className="flex text-2xl gap-2 items-center cursor-pointer"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <div className="text-purple-600">
          <Logo />
        </div>
        <p>Brainly</p>
      </div>
      {tags?.length > 0 && (
        <div className="mt-3">
          <div className="flex justify-between px-3">
            <p>Top brain</p>

            {selectedTagId && (
              <button
                className="hover:underline"
                onClick={() => {
                  selectTagHandler({ tagId: "" });
                }}
              >
                clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 p-2">
            {tags?.map((tag) => (
              <button
                key={tag._id}
                className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all"
                onClick={() => {
                  selectTagHandler({ tagId: tag._id });
                }}
              >
                <span className="font-medium text-sm">{tag.tag}</span>
                <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
          {/* <SidebarItem text="Twitter" icon={<Twitter />} />
        <SidebarItem text="Youtube" icon={<Youtube />} /> */}
        </div>
      )}
    </div>
  );
}
