import { useState } from "react";
import { TreeNode } from "./TreeNode";
import {
  useGetRootNode,
  useDeleteNode,
} from "@/module/services/hooks/useNode";
import { SquarePlus, Pencil, Trash2 } from "lucide-react";
import { useFileManager } from "@/module/context/FileManager";

export interface Node {
  _id: string;
  name: string;
  type: "folder" | "file";
  brainId?: string;
}

export type ActionState =
  | { type: "idle" }
  | { type: "editing" }
  | { type: "adding"; nodeType: "file" | "folder" };

export const TreeRoot = () => {
  const { data: rootNodeData, refetch: rootNodeRefetch } = useGetRootNode();
  
  const { mutate: deleteMutate } = useDeleteNode();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [actionState, setActionState] = useState<ActionState>({ type: "idle" });

  const { onFileSelect, onFolderSelect, setSelectedBrain } = useFileManager();

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
    if (selectedNode?._id !== node._id) {
      setActionState({ type: "idle" });
    }
    if (node.type === "file") {
      onFileSelect({ nodeId: node._id, nodename: node.name });
      setSelectedBrain(node?.brainId || "");
    }
    if (node.type === "folder") {
      onFolderSelect({ nodeId: node._id, nodename: node.name });
    }
  };

  const handleActionComplete = () => {
    setActionState({ type: "idle" });
    rootNodeRefetch();
  };

  const handleAddFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNode || selectedNode.type !== "folder") return;
    setActionState({ type: "adding", nodeType: "file" });
  };

  const handleAddFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNode || selectedNode.type !== "folder") return;
    setActionState({ type: "adding", nodeType: "folder" });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNode) return;
    setActionState({ type: "editing" });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNode) return;

    if (window.confirm(`Are you sure you want to delete "${selectedNode.name}"?`)) {
      deleteMutate(selectedNode._id, {
        onSuccess: () => {
          setSelectedNode(null);
          handleActionComplete();
        },
        onError: (err) => {
          console.error("Failed to delete node", err);
        },
      });
    }
  };

  const canAdd = selectedNode?.type === "folder";
  const canEdit = !!selectedNode;
  const canDelete = !!selectedNode;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center p-1">
        <h2 className="font-semibold">File Manager</h2>
        <div className="flex gap-1.5">
          <button
            title="Add File (select folder)"
            className={
              canAdd
                ? "text-gray-700 hover:text-blue-600"
                : "text-gray-300 cursor-not-allowed"
            }
            disabled={!canAdd}
            onClick={handleAddFile}
          >
            <SquarePlus size={15} />
          </button>
          <button
            title="Add Folder (select folder)"
            className={
              canAdd
                ? "text-gray-700 hover:text-blue-600"
                : "text-gray-300 cursor-not-allowed"
            }
            disabled={!canAdd}
            onClick={handleAddFolder}
          >
            <SquarePlus size={15} />
          </button>
          <button
            title="Rename"
            className={
              canEdit
                ? "text-gray-700 hover:text-green-600"
                : "text-gray-300 cursor-not-allowed"
            }
            disabled={!canEdit}
            onClick={handleEdit}
          >
            <Pencil size={15} />
          </button>
          <button
            title="Delete"
            className={
              canDelete
                ? "text-gray-700 hover:text-red-600"
                : "text-gray-300 cursor-not-allowed"
            }
            disabled={!canDelete}
            onClick={handleDelete}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {rootNodeData?.map((node) => (
        <TreeNode
          key={node?._id}
          node={node}
          refresh={rootNodeRefetch}
          selectedNode={selectedNode}
          actionState={actionState}
          onNodeSelect={handleNodeSelect}
          onActionComplete={handleActionComplete}
        />
      ))}
    </div>
  );
};