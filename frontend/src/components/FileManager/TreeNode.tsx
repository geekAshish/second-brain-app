import { useState, useEffect } from "react";
import { Node, ActionState } from "./TreeRoot";
import { useGetChildrenNode } from "@/module/services/hooks/useNode";

import { InlineEditForm } from "./InlineEditForm";
import { InlineCreateForm } from "./InlineCreateForm";

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
  } = useGetChildrenNode(node?._id);

  const isSelected = selectedNode?._id === node._id;
  const isEditing = isSelected && actionState.type === "editing";
  const isAdding = isSelected && actionState.type === "adding";

  useEffect(() => {
    if (isAdding && !expanded) {
      setExpanded(true);
      childrenNodeRefetch();
    }
  }, [isAdding, expanded, childrenNodeRefetch]);

  const onRefresh = () => {
    refresh();
    childrenNodeRefetch();
  };

  const onRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    onNodeSelect(node); 
    
    if (node.type === "folder") {
      if (!expanded) {
        childrenNodeRefetch();
      }
      setExpanded(!expanded);
    }
  };

  const onChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (node.type === "folder") {
      if (!expanded) {
        childrenNodeRefetch();
      }
      setExpanded(!expanded);
    }
  };

  const selectionClass = isSelected ? "bg-blue-100" : "hover:bg-gray-100";

  return (
    <div className="my-0.5 text-sm">
      <div
        className={`flex justify-between items-center group w-full p-1.5 rounded-md cursor-pointer ${selectionClass}`}
        onClick={isEditing ? (e) => e.stopPropagation() : onRowClick}
      >
        <div className="flex items-center min-w-0">
          {node?.type === "folder" && (
            <button
              onClick={onChevronClick}
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

          {node?.type !== "folder" && <span className="w-4 h-4 mr-0.5" />}

          {isEditing ? (
            <InlineEditForm
              node={node}
              onComplete={() => {
                onActionComplete();
                refresh();
              }}
              onCancel={onActionComplete}
            />
          ) : (
            <span
              className="flex items-center ml-1 text-gray-700 text-nowrap"
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

      {expanded && (
        <div className="border-l border-gray-200 ml-1">
          {isLoadingChildren && (
            <div className="flex items-center text-gray-500 p-1.5">
              <AiOutlineLoading className="animate-spin h-4 w-4 mr-2" />
              Loading...
            </div>
          )}

          {isAdding && (
            <InlineCreateForm
              parentId={node._id}
              type={actionState.nodeType}
              onComplete={() => {
                onActionComplete();
                childrenNodeRefetch();
              }}
              onCancel={onActionComplete}
            />
          )}

          {!isLoadingChildren &&
            childrenNode?.map((child: Node) => (
              <TreeNode
                key={child?._id}
                node={child}
                refresh={onRefresh}
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