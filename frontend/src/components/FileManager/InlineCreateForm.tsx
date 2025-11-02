import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useState } from "react";
import { useCreateNode } from "@/module/services/hooks/useNode";
import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  parentId: string;
  type: "file" | "folder";
  onComplete: () => void;
  onCancel: () => void;
}

export const InlineCreateForm = ({
  parentId,
  type,
  onComplete,
  onCancel,
}: Props) => {
  const [name, setName] = useState("");

  const { mutate: createNodeMutate, isPending: isLoading } = useCreateNode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (name.trim() === "" || isLoading) {
      onCancel();
      return;
    }

    createNodeMutate(
      { name: name.trim(), type, parentId },
      {
        onSuccess: onComplete,
        onError: (err) => {
          console.error("Failed to create node", err);
          onCancel();
        },
      }
    );
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="pl-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-1.5"
        onClick={stopProp}
      >
        <span className="mr-1.5">
          {isLoading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : type === "folder" ? (
            <FaFolder className="text-blue-500" />
          ) : (
            <FaFileAlt className="text-gray-500" />
          )}
        </span>
        <input
          type="text"
          placeholder={
            type === "file" ? "New file name..." : "New folder name..."
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-1 py-0.5 border rounded-md w-full text-sm"
          autoFocus
          disabled={isLoading}
          onBlur={onCancel}
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