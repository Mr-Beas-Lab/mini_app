import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CopyButton = ({ tonWalletAddress }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (tonWalletAddress) {
      navigator.clipboard.writeText(tonWalletAddress);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`w-full py-3 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition ${
        copied ? "bg-gray-dark" : "bg-blue hover:bg-blue-light"
      }`}
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default CopyButton;
