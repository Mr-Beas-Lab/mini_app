import { useState } from "react";
import { ArrowLeft, X, UploadCloud } from "lucide-react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/libs/firebase";  

interface ReceiveModalProps {
  onClose: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [receiptUrl, setReceiptUrl] = useState<string>("");

  const storage = getStorage(app);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; 
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `receipts/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setReceiptUrl(downloadURL);
        setUploading(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-[#1E1E1E] text-white w-full max-w-md rounded-xl overflow-hidden flex flex-col h-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>

          <h1 className="text-2xl font-bold">Fiat Wallet</h1>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2 text-center">
            Your Remittance Deposit
          </h2>
          <p className="text-center text-sm text-gray-300 mb-4 max-w-xs">
            Deposit to your country's Ambassador's Bank Account and upload your receipt.
          </p>

          {/* File Upload Section */}
          <label className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
            <UploadCloud size={20} />
            <span>{file ? file.name : "Upload Receipt"}</span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          {file && (
            <button
              onClick={handleUpload}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Upload"}
            </button>
          )}

          {uploading && (
            <p className="text-yellow-400 text-sm mt-2">Uploading... {Math.round(uploadProgress)}%</p>
          )}

          {receiptUrl && (
            <p className="text-green-400 text-sm mt-2">
              ✅ Upload Successful!{" "}
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View Receipt
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
