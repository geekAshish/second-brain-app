// components/FileManager/InlineCreateForm.tsx
// (Assuming you have a mutation hook like this)
// import { useCreateNode } from "@/module/services/hooks/useNode";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useState } from "react";
import { useCreateNode } from "@/module/services/hooks/useNode";

interface Props {
  parentId: string;
  type: "file" | "folder";
  onComplete: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}

export const InlineCreateForm = ({
  parentId,
  type,
  onRefresh,
  onComplete,
  onCancel,
}: Props) => {
  const [name, setName] = useState("");

  const { mutate: createNodeMutate } = useCreateNode();
  
    const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          e.stopPropagation();
      createNodeMutate(
        { name, type, parentId },
        {
          onSuccess: () => {
            setName("");
            onRefresh();
            onCancel();
          },
        }
      );
    };

  // Stop propagation to prevent node click
  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="pl-4"> {/* Indent under parent */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-1.5"
        onClick={stopProp}
      >
        <span className="mr-1.5">
          {type === "folder" ? (
            <FaFolder className="text-blue-500" />
          ) : (
            <FaFileAlt className="text-gray-500" />
          )}
        </span>
        <input
          type="text"
          placeholder={type === "file" ? "New file name..." : "New folder name..."}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-1 py-0.5 border rounded-md w-full text-sm"
          autoFocus
          onBlur={onCancel} // Cancel on blur
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              onCancel();
            }
          }}
        />
      </form>
    </div>
  );
};