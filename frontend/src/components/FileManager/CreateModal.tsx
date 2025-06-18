import { useCreateNode } from "@/module/services/hooks/useNode";
import { useState } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  onRefresh: () => void;
  parentId?: string | null;
}

export const CreateModal = ({ show, onClose, onRefresh, parentId }: Props) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"folder" | "file">("folder");

  const { mutate: createNodeMutate } = useCreateNode();

  const handleSubmit = async () => {
    createNodeMutate(
      { name, type, parentId },
      {
        onSuccess: () => {
          setName("");
          onRefresh();
          onClose();
        },
      }
    );
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded shadow w-80">
        <h3 className="text-lg mb-3">Create new</h3>
        <input
          className="border w-full mb-3 p-1"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border w-full mb-3 p-1"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="folder">Folder</option>
          <option value="file">File</option>
        </select>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Create
          </button>
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
