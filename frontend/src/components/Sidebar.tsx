import { useNavigate } from "react-router-dom";
import { Logo } from "@/icons/Logo";
import { TreeRoot } from "./FileManager/TreeRoot";

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
  tags?: tags[];
  selectedTagId?: string;
  selectTagHandler?: ({ tagId }: { tagId: string }) => void;
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

      {/* TODO: SHOULD BE ONE NODEACTION WORKING ON IT */}
      <div>
        <TreeRoot />
      </div>
      <p>Top brain</p>
      <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => {
                  
                  // --- 4. Added Selection Logic ---
                  // This is key for good UX. We check if the current tag is the selected one.
                  const isSelected = tag._id === selectedTagId;

                  return (
                    <button
                      key={tag._id}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded-full transition-all duration-200
                        ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      `}
                      onClick={() => {
                        selectTagHandler?.({ tagId: tag._id });
                      }}
                    >
                      <span className="text-sm font-medium">{tag.tag}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full
                          ${
                            isSelected
                              ? "bg-purple-400 text-purple-50"
                              : "bg-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {tag.count}
                      </span>
                    </button>
                  );
                })}
              </div>
    </div>
  );
}
