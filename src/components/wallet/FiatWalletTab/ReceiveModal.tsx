import { useState } from "react";
import { ArrowLeft, X, UploadCloud } from "lucide-react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/libs/firebase";
import { Country } from "./CountrySelector";

interface ReceiveModalProps {
  onClose: () => void;
  country: Country | null;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ onClose, country }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiptUrl, setReceiptUrl] = useState("");

  const storage = getStorage(app);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    selectedFile && setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

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
      <div className="bg-[#1E1E1E] text-white w-full max-w-md rounded-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={onClose} className="hover:text-gray-300">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Fiat Deposit</h1>
          <button onClick={onClose} className="hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* Country Display */}
        {country && (
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-center gap-4">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-center">
                <p className="font-semibold text-lg">{country.name}</p>
                <p className="text-gray-400 text-sm">{country.code}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-center text-gray-300 mb-6">
            Deposit to your country's Ambassador's Bank Account and upload your receipt.
          </p>

          <label className="w-full bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
            <UploadCloud size={40} className="text-gray-400 mb-2" />
            <span className="text-gray-300">
              {file ? file.name : "Click to upload receipt"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {uploading ? `Uploading ${Math.round(uploadProgress)}%` : "Confirm Upload"}
            </button>
          )}

          {receiptUrl && (
            <div className="mt-6 text-center text-green-400">
              ✅ Upload successful!{" "}
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-300"
              >
                View receipt
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;