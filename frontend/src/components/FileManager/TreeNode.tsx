import { useState } from "react";
import { Node } from "./TreeRoot";
import {
  useGetChildrenNode,
  useGetNode,
} from "@/module/services/hooks/useNode";
import { useFileManager } from "@/module/context/FileManager";
import { CreateModal } from "./CreateModal";
import { NodeActions } from "./NodeActions";

interface Props {
  node: Node;
  refresh: () => void;
}

export const TreeNode = ({ node, refresh }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data: childrenNode, refetch: childrenNodeRefetch } =
    useGetChildrenNode(node?._id);

  const { onFileSelect, onFolderSelect, setSelectedBrain } = useFileManager();

  const loadChildren = async () => {
    setLoading(true);
    childrenNodeRefetch();
    setLoading(false);
  };

  const onRefresh = () => {
    refresh();
    childrenNodeRefetch();
  };

  // TODO: SHOULD BE ONE NODEACTION WORKING ON IT
  const onNodeClick = () => {
    if (node.type === "file") {
      onFileSelect({ nodeId: node._id, nodename: node.name });
      setSelectedBrain(node?.brainId || "");
    }

    if (node.type === "folder")
      onFolderSelect({ nodeId: node._id, nodename: node.name });
  };

  const toggleExpand = () => {
    if (!expanded) {
      loadChildren();
    }
    setExpanded(!expanded);
  };

  return (
    <div
      className="ml-2 my-1 text-xs"
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick();
      }}
    >
      <div className="flex justify-between items-center group w-full">
        {/* {node?.type === "folder" && (
          <button onClick={toggleExpand}>{expanded ? "-" : "+"}</button>
        )} */}
        <span onClick={toggleExpand} className="cursor-pointer text-nowrap">
          {node?.type === "folder" ? (expanded ? "📂" : "📁") : "📄"}{" "}
          {node?.name}
        </span>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <NodeActions
            node={{
              nodeId: node?._id,
              nodename: node?.name,
              nodetype: node.type,
            }}
            refresh={onRefresh}
            openModal={() => setShowModal(true)}
          />
        </div>
      </div>

      {expanded && loading && <div className="ml-4">Loading...</div>}

      {expanded &&
        childrenNode?.map((child) => (
          <TreeNode key={child?._id} node={child} refresh={onRefresh} />
        ))}

      <CreateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onRefresh={loadChildren}
        parentId={node._id}
      />
    </div>
  );
};
