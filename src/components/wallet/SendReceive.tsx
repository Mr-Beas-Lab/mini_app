import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import ReceiveModal from "./ReceiveModal";

const SendReceive = () => {
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  return (
    <div>
      {!isReceiveOpen ? (
        <div className="flex gap-4">
          <button
            onClick={() => setIsReceiveOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-blue to-blue-light hover:from-blue-dark hover:to-blue text-white rounded-lg shadow-md transition"
          >
            <ArrowDown className="w-5 h-5" />
            <span>Receive</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-blue to-blue-light hover:from-blue-dark hover:to-blue text-white rounded-lg shadow-md transition">
            <ArrowUp className="w-5 h-5" />
            <span>Send</span>
          </button>
        </div>
      ) : (
        <ReceiveModal onClose={() => setIsReceiveOpen(false)} />
      )}
    </div>
  );
};

export default SendReceive;
