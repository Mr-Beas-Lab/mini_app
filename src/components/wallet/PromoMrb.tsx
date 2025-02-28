import { useState } from "react";
import { ArrowUpRightFromSquare, X } from "lucide-react";
import { motion } from "framer-motion";

const PromoMrb = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="relative w-full bg-gradient-to-r from-purple-600 to-red-500 rounded-lg shadow-md h-[100px] my-3 flex items-center px-4 py-2"
    >
      <div className="flex flex-col flex-1 text-white text-sm">
        <h1 className="font-medium">Join community treasury and governance with our utility token</h1>
        <a
          href="https://t.me/blum/app?startapp=memepadjetton_MRB_3UKTM-ref_jM0CnzEvER"
          className="flex items-center gap-1 font-bold mt-1 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>$MRB</b> Buy now
        </a>
        <small className="flex items-center mt-1 cursor-pointer hover:underline">
          Learn more <ArrowUpRightFromSquare className="w-4 h-4 ml-1" />
        </small>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-white hover:text-gray-300"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default PromoMrb;
