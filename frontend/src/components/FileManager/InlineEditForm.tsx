// components/FileManager/InlineEditForm.tsx
// (Assuming you have a mutation hook like this)
// import { useUpdateNode } from "@/module/services/hooks/useNode";
import { Node } from "./TreeRoot";
import { useEffect, useState } from "react";

interface Props {
  node: Node;
  onComplete: () => void;
  onCancel: () => void;
}

export const InlineEditForm = ({ node, onComplete, onCancel }: Props) => {
  const [name, setName] = useState(node.name);

  // --- Mock/Real API Mutation ---
  // const { mutate: updateNode, isLoading } = useUpdateNode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (name === node.name || name.trim() === "") {
      onCancel();
      return;
    }
    
    console.log(`API CALL: Update ${node._id} to "${name}"`);
    // updateNode({ nodeId: node._id, name: name.trim() }, {
    //   onSuccess: onComplete,
    //   onError: (err) => {
    //     console.error("Failed to update node", err);
    //     onCancel();
    //   }
    // });

    // Mocking success
    onComplete();
  };

  // Stop propagation to prevent node click
  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="ml-1 px-1 py-0.5 border rounded-md w-full"
        autoFocus
        onClick={stopProp}
        onBlur={handleSubmit} // Save on blur
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