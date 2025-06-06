import { useState } from "react";
import { Plus, Share } from "lucide-react";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Sidebar } from "@/components/Sidebar";
import { Modal } from "@/components/ui/Modal";
import { useContent } from "@/module/services/hooks/useContent";
import { CreateContentModal } from "@/components/CreateContentModal";

import { useTags } from "@/module/services/hooks/useTags";
import { useGetUpdateShareBrainStatusFetcher } from "@/module/services/hooks/useShare";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openShareBrainModal, setOpenShareBrainModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>("");

  const { data: shareUrlData, mutate: shareURLMutate } =
    useGetUpdateShareBrainStatusFetcher();

  const { data: contentsData, refetch } = useContent({ tag: selectedTagId });
  const { data: tags, refetch: refreshTags } = useTags();

  console.log(contentsData);

  const handleShareBrain = async () => {
    shareURLMutate();
  };

  const selectTagHandler = ({ tagId }: { tagId: string }) => {
    setSelectedTagId(tagId);
  };

  return (
    <div>
      <Sidebar
        tags={tags}
        selectedTagId={selectedTagId}
        selectTagHandler={selectTagHandler}
      />
      <div className="p-4 ml-52 min-h-screen bg-gray-100 border-2">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          refresh={refetch}
          refreshTags={refreshTags}
        />
        <Modal
          open={openShareBrainModal}
          onClose={() => setOpenShareBrainModal(false)}
        >
          <div>
            <p>http://localhost:5173/share-brain/{shareUrlData}?type=brain</p>
          </div>
        </Modal>
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            variant="primary"
            text="Add content"
            startIcon={<Plus />}
          ></Button>
          <Button
            onClick={async () => {
              handleShareBrain();
              setOpenShareBrainModal(true);
            }}
            variant="secondary"
            text="Share brain"
            startIcon={<Share />}
          ></Button>
        </div>

        <div className="columns-1 sm:columns-3 gap-4 mt-10">
          {contentsData?.map(
            (
              { type, link, title, description, _id, createdAt },
              index: number
            ) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <Card
                  key={index}
                  contentId={_id}
                  type={type}
                  link={link}
                  title={title}
                  description={description}
                  createdAt={createdAt}
                  refresh={refetch}
                  refreshTags={refreshTags}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
