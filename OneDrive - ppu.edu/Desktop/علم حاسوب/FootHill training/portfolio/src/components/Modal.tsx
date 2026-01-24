import React from "react";

export interface ModalProps {
  modalTitle: string;
  modalContent: string;
  onClose: () => void;
  onSave: () => void;
}
export default function Modal(modalProps: ModalProps) {
  return (
    <article>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-secondary/30 p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4"> {modalProps.modalTitle}</h2>
          <p className="mb-4">{modalProps.modalContent}</p>
          <div className="flex justify-end" gap-2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl"
              onClick={modalProps.onClose}
            >
              Close
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-2xl ml-2"
              onClick={modalProps.onSave}
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
