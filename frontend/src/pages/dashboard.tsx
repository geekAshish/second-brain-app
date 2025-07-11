import { useCallback, useRef, useState } from "react";
import { Plus, Share } from "lucide-react";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Sidebar } from "@/components/Sidebar";
import { Modal } from "@/components/ui/Modal";
import { useContent } from "@/module/services/hooks/useContent";
import { CreateContentModal } from "@/components/CreateContentModal";

import { useTags } from "@/module/services/hooks/useTags";
import { useGetUpdateShareBrainStatusFetcher } from "@/module/services/hooks/useShare";
import { useFileManager } from "@/module/context/FileManager";

export default function Dashboard() {
  const observer = useRef<IntersectionObserver | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [openShareBrainModal, setOpenShareBrainModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>("");

  const { selectedBrain, currentSelectedFile } = useFileManager();

  const {
    data: shareUrlData,
    mutate: shareURLMutate,
    isError,
  } = useGetUpdateShareBrainStatusFetcher();

  const {
    data: contentsData,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useContent({
    tag: selectedTagId,
    size: 3,
    brainId: selectedBrain,
  });
  const { data: tags, refetch: refreshTags } = useTags();

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          root: null,
          rootMargin: "0px 0px 50px 0px",
          threshold: 0.1,
        }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  const handleShareBrain = async ({
    brainId,
    contentId,
  }: {
    brainId?: string;
    contentId?: string;
  }) => {
    shareURLMutate({ brainId: brainId, contentId });
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
          {isError ? (
            <div>
              <p>Please select a brain or share a content</p>
            </div>
          ) : (
            <div>
              <p>http://localhost:5173/share-brain/{shareUrlData?.shareHash}</p>
            </div>
          )}
        </Modal>
        {currentSelectedFile?.nodeId ? (
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
                handleShareBrain({ brainId: selectedBrain });
                setOpenShareBrainModal(true);
              }}
              variant="secondary"
              text="Share brain"
              startIcon={<Share />}
            ></Button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <p>Start with creating a file or choose one</p>
          </div>
        )}

        <div className="columns-1 sm:columns-3 gap-4 mt-10">
          {contentsData?.pages.map((contentsPage) => {
            const items = contentsPage?.data?.contents || [];

            return items.map(
              (
                { type, link, title, description, _id, createdAt },
                index: number
              ) => {
                const isLast =
                  index === items.length - 1 &&
                  contentsData.pages[contentsData.pages.length - 1] ===
                    contentsPage;

                return (
                  <div
                    key={_id}
                    className="mb-4 break-inside-avoid"
                    ref={isLast ? lastPostElementRef : null}
                  >
                    <Card
                      contentId={_id}
                      type={type}
                      link={link}
                      title={title}
                      description={description}
                      createdAt={createdAt}
                      refresh={refetch}
                      refreshTags={refreshTags}
                      shareUrlData={shareUrlData}
                      handleShareBrain={handleShareBrain}
                    />
                  </div>
                );
              }
            );
          })}
        </div>
      </div>
    </div>
  );
}
