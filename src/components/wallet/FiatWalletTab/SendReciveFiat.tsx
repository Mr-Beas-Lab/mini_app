import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";

const ModalContainer = () => {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Buttons to Open Modals */}
      <button
        onClick={() => setIsReceiveModalOpen(true)}
        className="bg-blue text-white px-5 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue flex items-center gap-2"
      >
        <ArrowDownCircle size={20} />
        Receive
      </button>

      <button
        onClick={() => setIsSendModalOpen(true)}
        className="bg-blue text-white px-5 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue flex items-center gap-2"
      >
        <ArrowUpCircle size={20} />
        Send
      </button>

      {/* Receive Modal */}
      {isReceiveModalOpen && (
        <ReceiveModal onClose={() => setIsReceiveModalOpen(false)} />
      )}

      {/* Send Modal */}
      {isSendModalOpen && (
        <SendModal onClose={() => setIsSendModalOpen(false)} />
      )}
    </div>
  );
};

export default ModalContainer;