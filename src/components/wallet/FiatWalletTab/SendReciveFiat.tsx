import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, MoveRight } from "lucide-react";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";

const ModalContainer = () => {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap justify-center  gap-2">
      {/* Deposit Button */}
      <button
        onClick={() => setIsReceiveModalOpen(true)}
        className="bg-blue text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue flex items-center gap-2"
      >
        <ArrowDownCircle size={20} />
        Deposit
      </button>

      {/* Remittance Button */}
      <button
        onClick={() => setIsSendModalOpen(true)}
        className="bg-blue text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue flex items-center gap-2"
      >
        <ArrowUpCircle size={20} />
        Remittance
      </button>

      {/* Transfer Button */}
      <button
        onClick={() => setIsSendModalOpen(true)}
        className="bg-blue text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue flex items-center gap-2"
      >
        <MoveRight size={20} />
        Transfer
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
