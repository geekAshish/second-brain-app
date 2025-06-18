import { useCreateNode, useGetNode } from "@/module/services/hooks/useNode";
import { useState } from "react";

type Node = {
  _id: string;
  name: string;
  type: "folder" | "file";
};

interface Props {
  parentId?: string | null;
}

export const DirectoryTree = ({ parentId = null }: Props) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"folder" | "file">("folder");

  const { data: nodeData, refetch: refetchNode } = useGetNode({
    parentId: parentId || "",
  });
  const { mutate: mutateNode } = useCreateNode();

  const addNode = async () => {
    mutateNode({ name, type, parentId });
    setName("");
    refetchNode();
  };

  return (
    <div className="ml-4 mt-4 border p-2 rounded">
      <h3>{parentId ? "Subfolder" : "Root"}</h3>

      {nodeData?.map((node) => (
        <div key={node?._id} className="mt-2">
          {node?.type === "folder" ? (
            <details>
              <summary>{node?.name}</summary>
              <DirectoryTree parentId={node?._id} />
            </details>
          ) : (
            <div>📄 {node?.name}</div>
          )}
        </div>
      ))}

      <div className="mt-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "folder" | "file")}
        >
          <option value="folder">Folder</option>
          <option value="file">File</option>
        </select>
        <button onClick={addNode}>Add</button>
      </div>
    </div>
  );
};
