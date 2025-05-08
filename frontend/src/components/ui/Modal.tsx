import { ReactNode } from "react";

interface PropType {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// controlled component
export function Modal({ open, onClose, children }: PropType) {
  return (
    <div>
      {open && (
        <div>
          <div className="fixed inset-0 bg-slate-500 opacity-60 z-40"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <div
              className="flex flex-col justify-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="bg-white p-2 rounded-lg shadow-lg">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
