import { createContext, ReactNode, useContext, useState } from "react";

interface FileManagerContextInterface {
  selectedBrain: string;

  currentSelectedFolder: SelectedNodeInterface;
  currentSelectedFile: SelectedNodeInterface;

  setSelectedBrain: (s: string) => void;

  onFolderSelect: ({ nodename, nodeId }: SelectedNodeInterface) => void;
  onFileSelect: ({ nodename, nodeId }: SelectedNodeInterface) => void;
}

interface SelectedNodeInterface {
  nodename: string | null;
  nodeId: string | null;
}

const FileManagerContext = createContext<FileManagerContextInterface | null>(
  null
);

const FileManagerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSelectedFolder, setCurrentSelectedFolder] =
    useState<SelectedNodeInterface>({ nodeId: null, nodename: null });
  const [currentSelectedFile, setCurrentSelectedFile] =
    useState<SelectedNodeInterface>({ nodeId: null, nodename: null });
  const [selectedBrain, setSelectedBrain] = useState("");

  console.log(currentSelectedFile, currentSelectedFolder);

  const onFolderSelect = ({ nodename, nodeId }: SelectedNodeInterface) => {
    setCurrentSelectedFolder({ nodename, nodeId });
  };
  const onFileSelect = ({ nodename, nodeId }: SelectedNodeInterface) => {
    setCurrentSelectedFile({ nodename, nodeId });
  };

  const fileManagerContextValue: FileManagerContextInterface = {
    selectedBrain,

    currentSelectedFolder,
    currentSelectedFile,

    setSelectedBrain,

    onFolderSelect,
    onFileSelect,
  };

  return (
    <FileManagerContext.Provider value={fileManagerContextValue}>
      {children}
    </FileManagerContext.Provider>
  );
};

const useFileManager = () => {
  const context = useContext(FileManagerContext);
  if (!context)
    throw new Error(
      "useFileManager must be used within an FileManagerProvider"
    );

  return context;
};

export { FileManagerProvider, useFileManager };
