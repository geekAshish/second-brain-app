import { useState } from "react";
import { TreeNode } from "./TreeNode";
import { CreateModal } from "./CreateModal";

import { useGetRootNode } from "@/module/services/hooks/useNode";
import { SquarePlus } from "lucide-react";

export interface Node {
  _id: string;
  name: string;
  type: "folder" | "file";
  brainId?: string;
}

export const TreeRoot = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: rootNodeData, refetch: rootNodeRefetch } = useGetRootNode();

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <h2 className="font-semibold">File Manager</h2>

        <button className="text-green-600" onClick={() => setShowModal(true)}>
          <SquarePlus size={15} />
        </button>
      </div>

      {rootNodeData?.map((node) => (
        <TreeNode
          key={node?._id}
          node={node}
          refresh={() => rootNodeRefetch()}
        />
      ))}

      <CreateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onRefresh={() => rootNodeRefetch()}
      />
    </div>
  );
};
