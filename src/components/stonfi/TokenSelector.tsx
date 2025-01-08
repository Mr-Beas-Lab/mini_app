
import type { AssetInfo } from "@ston-fi/omniston-sdk-react";
import { ChevronDown } from "lucide-react";
import { FC, useState } from "react";

type AssetSelectProps = {
  assets?: AssetInfo[];
  selectedAsset: AssetInfo | null;
  onAssetSelect?: (asset: AssetInfo | null) => void;
  className?: string;
  loading?: boolean;
};

export const AssetSelect: FC<AssetSelectProps> = ({
  assets = [],
  selectedAsset,
  onAssetSelect,
  loading,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const handleAssetSelect = (assetAddress: string) => {
    const asset = assets.find(
      (asset) => asset.address?.address === assetAddress
    );

    if (asset && onAssetSelect) {
      onAssetSelect(asset);
    }

    setOpen(false);
  };

  const handleFilter = (search: string) => {
    return assets.filter((asset) =>
      asset.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className={`skeleton w-full h-10 ${className}`}>
        {/* Skeleton loading animation */}
      </div>
    );
  }

  return (
    <div className={`relative ${className} `}>
      <button
        type="button"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-800  text-white p-3 rounded-lg flex items-center justify-between"
      >
        {selectedAsset ? (
          <>
            <img
              src={selectedAsset.imageUrl}
              alt={selectedAsset.name ?? selectedAsset.symbol}
              className="w-5 h-5 rounded-full mr-2"
            />
            {selectedAsset.symbol}
          </>
        ) : (
          "Select asset..."
        )}
        <ChevronDown className=" h-4 w-10 opacity-50" />
      </button>

      {open && (
        <div className="absolute w-full bg-gray-800 text-white mt-2 rounded-lg shadow-lg z-10">
          <input
            type="text"
            placeholder="Search asset..."
            onChange={(e) => handleFilter(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-t-lg border-b border-gray-600 outline-none"
          />
          <div className="max-h-64 overflow-y-auto">
            {assets.length === 0 ? (
              <div className="p-3">No assets found.</div>
            ) : (
              handleFilter("").map((asset) => (
                <div
                  key={asset.address?.address}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleAssetSelect(asset.address?.address || "")}
                >
                  <img
                    src={asset.imageUrl}
                    alt={asset.name ?? asset.symbol}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  {asset.symbol}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
