import { useState } from "react";
import { TreeNode } from "./TreeNode";
import { useGetRootNode } from "@/module/services/hooks/useNode";
import { SquarePlus, Pencil, Trash2 } from "lucide-react";
import { useFileManager } from "@/module/context/FileManager";

// This interface should be in one shared place,
// but is here for component completeness.
export interface Node {
  _id: string;
  name: string;
  type: "folder" | "file";
  brainId?: string;
}

// Define the action states
export type ActionState =
  | { type: "idle" }
  | { type: "editing" }
  | { type: "adding"; nodeType: "file" | "folder" };

export const TreeRoot = () => {
  const { data: rootNodeData, refetch: rootNodeRefetch } = useGetRootNode();

  // --- State Lifted Here ---
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [actionState, setActionState] = useState<ActionState>({ type: "idle" });

  // --- Context for file/folder selection logic ---
  const { onFileSelect, onFolderSelect, setSelectedBrain } = useFileManager();

  // --- Handlers ---
  const handleNodeSelect = (node: Node) => {
    // Select the node
    setSelectedNode(node);
    
    // Reset any pending actions if a *different* node is clicked
    if (selectedNode?._id !== node._id) {
       setActionState({ type: "idle" });
    }

    // Also perform the original context click logic
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
    // After an action, we should refetch the root
    rootNodeRefetch();
    // We clear selection, or you could keep it. Clearing is safer.
    // setSelectedNode(null);
  };

  // --- Button Click Handlers ---
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

    // You would open a confirmation modal here
    if (window.confirm(`Are you sure you want to delete "${selectedNode.name}"?`)) {
      console.log(`API CALL: Delete ${selectedNode._id}`);
      // useDeleteNode.mutate(selectedNode._id, {
      //   onSuccess: handleActionComplete
      // });

      // Mocking success
      setSelectedNode(null);
      handleActionComplete();
    }
  };

  // --- Button Disabled Logic ---
  const canAdd = selectedNode?.type === "folder";
  const canEdit = !!selectedNode;
  const canDelete = !!selectedNode;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center p-1">
        <h2 className="font-semibold">File Manager</h2>

        {/* --- New Action Bar --- */}
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
            <SquarePlus size={15} /> {/* Re-using for 'add file' */}
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
            <SquarePlus size={15} /> {/* You can change this icon */}
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

      {/* --- Pass all state down to children --- */}
      {rootNodeData?.map((node) => (
        <TreeNode
          key={node?._id}
          node={node}
          refresh={rootNodeRefetch}
          // --- State management props ---
          selectedNode={selectedNode}
          actionState={actionState}
          onNodeSelect={handleNodeSelect}
          onActionComplete={handleActionComplete}
          // onRefreshAndSelect={handleNodeSelect}
        />
      ))}
    </div>
  );
};