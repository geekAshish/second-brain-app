import { useState } from "react";
import { useDeleteNode, useUpdateNode } from "@/module/services/hooks/useNode";
import { Edit2, SquarePlus, Trash2 } from "lucide-react";

interface Node {
  nodename: string | null;
  nodetype: string | null;
  nodeId: string | null;
}

interface Props {
  node: Node;
  refresh: () => void;
  openModal: () => void;
}

export const NodeActions = ({ node, refresh, openModal }: Props) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node?.nodename || "");

  const { mutate: updateMutate } = useUpdateNode();
  const { mutate: deleteMutate } = useDeleteNode();

  const handleRename = async () => {
    if (!node?.nodeId || !name) return;

    updateMutate(
      { parentId: node?.nodeId, filename: name },
      {
        onSuccess: () => {
          setEditing(false);
          refresh();
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!node?.nodeId || !name) return;

    if (window.confirm("Are you sure?")) {
      deleteMutate(node?.nodeId, {
        onSuccess: () => {
          refresh();
        },
      });
    }
  };

  return (
    <div className="w-full">
      <div>
        {/* <p className="font-bold mb-4">
          {node?.nodename ? node?.nodename : "File Manager"}
        </p> */}

        <div className="flex justify-end">
          {node?.nodename && node?.nodeId && (
            <button className="text-blue-600" onClick={() => setEditing(true)}>
              <Edit2 size={12} />
            </button>
          )}

          {node?.nodetype === "folder" && (
            <button className="text-green-600 ml-1" onClick={openModal}>
              <SquarePlus size={12} />
            </button>
          )}

          <button className="text-red-600 ml-1" onClick={handleDelete}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div>
        {editing && (
          <div>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
              className="border rounded px-1"
            />
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};
