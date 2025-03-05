import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, MoveRight, ShoppingCart } from "lucide-react";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";

const ModalContainer = () => {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap justify-center gap-2">
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

      {/* Buy Token Button */}
      <button className="bg-blue  text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2">
        <ShoppingCart size={20} />
        <a href="https://t.me/blum/app?startapp=memepadjetton_MRB_3UKTM-ref_jM0CnzEvER">
          Buy Token
        </a>
      </button>

      {/* Receive Modal */}
      {isReceiveModalOpen && <ReceiveModal onClose={() => setIsReceiveModalOpen(false)} />}

      {/* Send Modal */}
      {isSendModalOpen && <SendModal onClose={() => setIsSendModalOpen(false)} />}
    </div>
  );
};

export default ModalContainer;
