import { useState, useEffect } from "react";
import { Node, ActionState } from "./TreeRoot"; // Import shared types
import { useGetChildrenNode } from "@/module/services/hooks/useNode";

// --- New Form Imports ---
import { InlineEditForm } from "./InlineEditForm";
import { InlineCreateForm } from "./InlineCreateForm";

// Icon Imports
import {
  FaFolder,
  FaFolderOpen,
  FaFileAlt,
  FaChevronRight,
} from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  node: Node;
  refresh: () => void;
  // --- New Props from TreeRoot ---
  selectedNode: Node | null;
  actionState: ActionState;
  onNodeSelect: (node: Node) => void;
  onActionComplete: () => void;
}

export const TreeNode = ({
  node,
  refresh,
  selectedNode,
  actionState,
  onNodeSelect,
  onActionComplete,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const {
    data: childrenNode,
    refetch: childrenNodeRefetch,
    isLoading: isLoadingChildren,
  } = useGetChildrenNode(node?._id); // Disable on mount

  // --- Prop-driven State ---
  const isSelected = selectedNode?._id === node._id;
  const isEditing = isSelected && actionState.type === "editing";
  const isAdding = isSelected && actionState.type === "adding";

  // --- Auto-expand if we're adding a child ---
  useEffect(() => {
    if (isAdding && !expanded) {
      setExpanded(true);
      childrenNodeRefetch(); // Fetch children
    }
  }, [isAdding, expanded, childrenNodeRefetch]);

  // Combined refresh
  const onRefresh = () => {
    refresh();
    childrenNodeRefetch();
  };

  // --- *** THE FIX IS HERE *** ---

  // 1. Handler for the main row click
  const onRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // ACTION 1: Select the node
    onNodeSelect(node); 
    
    // ACTION 2: If it's a folder, toggle it
    if (node.type === "folder") {
      if (!expanded) {
        childrenNodeRefetch();
      }
      setExpanded(!expanded);
    }
  };

  // 2. Handler for the chevron button click
  const onChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // <-- Prevents onRowClick from firing

    // ACTION: Only toggle the folder
    if (node.type === "folder") {
      if (!expanded) {
        childrenNodeRefetch();
      }
      setExpanded(!expanded);
    }
  };

  // Dynamic class for highlighting
  const selectionClass = isSelected ? "bg-blue-100" : "hover:bg-gray-100";

  return (
    <div className="my-0.5 text-sm">
      {/* Main interactive row */}
      <div
        className={`flex justify-between items-center group w-full p-1.5 rounded-md cursor-pointer ${selectionClass}`}
        // Click handler is disabled during edit, otherwise uses the new onRowClick
        onClick={isEditing ? (e) => e.stopPropagation() : onRowClick}
      >
        <div className="flex items-center min-w-0">
          {/* Expander Chevron */}
          {node?.type === "folder" && (
            <button
              onClick={onChevronClick} // <-- Uses the separate chevron handler
              className="p-0.5 rounded-sm hover:bg-gray-200"
              aria-label={expanded ? "Collapse folder" : "Expand folder"}
            >
              <FaChevronRight
                className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                  expanded ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>
          )}

          {/* Spacer for files */}
          {node?.type !== "folder" && <span className="w-4 h-4 mr-0.5" />}

          {/* --- Conditional Rename Form --- */}
          {isEditing ? (
            <InlineEditForm
              node={node}
              onComplete={() => {
                onActionComplete();
                refresh(); // Refresh parent list
              }}
              onCancel={onActionComplete}
            />
          ) : (
            <span
              className="flex items-center ml-1 text-gray-700 text-nowrap"
              // <-- NO onClick here. Clicks fall through to the parent div's onRowClick.
            >
              <span className="mr-1.5">
                {node?.type === "folder" ? (
                  <span className="text-blue-500">
                    {expanded ? <FaFolderOpen /> : <FaFolder />}
                  </span>
                ) : (
                  <FaFileAlt className="text-gray-500" />
                )}
              </span>
              <span className="truncate">{node?.name}</span>
            </span>
          )}
        </div>
      </div>

      {/* Children Section (Indented) */}
      {expanded && (
        <div className="border-l border-gray-200 ml-1">
          {isLoadingChildren && (
            <div className="flex items-center text-gray-500 p-1.5">
              <AiOutlineLoading className="animate-spin h-4 w-4 mr-2" />
              Loading...
            </div>
          )}

          {/* --- Conditional Create Form --- */}
          {isAdding && (
            <InlineCreateForm
              parentId={node._id}
              type={actionState.nodeType}
              onRefresh={onRefresh}
              onComplete={() => {
                onActionComplete();
                childrenNodeRefetch(); // Refresh this node's children
              }}
              onCancel={onActionComplete}
            />
          )}

          {/* Child Nodes */}
          {!isLoadingChildren &&
            childrenNode?.map((child: Node) => (
              <TreeNode
                key={child?._id}
                node={child}
                refresh={onRefresh} // This node's refresh
                // --- Pass all state down ---
                selectedNode={selectedNode}
                actionState={actionState}
                onNodeSelect={onNodeSelect}
                onActionComplete={onActionComplete}
              />
            ))}
        </div>
      )}
    </div>
  );
};