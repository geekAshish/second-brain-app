import { Node } from "./TreeRoot";
import { useState } from "react";
import { useUpdateNode } from "@/module/services/hooks/useNode";

interface Props {
  node: Node;
  onComplete: () => void;
  onCancel: () => void;
}

export const InlineEditForm = ({ node, onComplete, onCancel }: Props) => {
  const [name, setName] = useState(node.name);

  const { mutate: updateMutate, isPending: isLoading } = useUpdateNode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (name.trim() === "" || name === node.name || isLoading) {
      onCancel();
      return;
    }

    updateMutate(
      { parentId: node._id, filename: name.trim() },
      {
        onSuccess: onComplete,
        onError: (err) => {
          console.error("Failed to update node", err);
          onCancel();
        },
      }
    );
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="ml-1 px-1 py-0.5 border rounded-md w-full text-sm"
        autoFocus
        disabled={isLoading}
        onClick={stopProp}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onCancel();
          }
          if (e.key === "Enter") {
            e.stopPropagation();
            handleSubmit(e);
          }
        }}
      />
    </form>
  );
};