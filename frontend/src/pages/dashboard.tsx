import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Modal } from "../components/ui/Modal";

const shareBrainFetcher = async () => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/content/share-brain`,
    {
      share: true,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

  const shareUrl = response.data.hash;

  return shareUrl;
};

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openShareBrainModal, setOpenShareBrainModal] = useState(false);
  const [urlHash, setUrlHash] = useState("");
  const { contents, refresh } = useContent();

  const handleShareBrain = async () => {
    const hash = await shareBrainFetcher();
    setUrlHash(hash);
  };

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-52 min-h-screen bg-gray-100 border-2">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <Modal
          open={openShareBrainModal}
          onClose={() => setOpenShareBrainModal(false)}
        >
          <div>
            <p>http://localhost:5173/share-brain/{urlHash}?type=brain</p>
          </div>
        </Modal>
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            variant="primary"
            text="Add content"
            startIcon={<PlusIcon />}
          ></Button>
          <Button
            onClick={async () => {
              handleShareBrain();
              setOpenShareBrainModal(true);
            }}
            variant="secondary"
            text="Share brain"
            startIcon={<ShareIcon />}
          ></Button>
        </div>

        <div className="columns-1 sm:columns-2 gap-4 mt-10">
          {contents?.map(
            ({ type, link, title, description, createdAt }, index: number) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <Card
                  key={index}
                  type={type}
                  link={link}
                  title={title}
                  description={description}
                  createdAt={createdAt}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
