import { formatBalance } from "@/libs/formatBalance";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const AssetTab = ({ jettons, loading }) => {
  const { t } = useTranslation();

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      ) : jettons && jettons.length > 0 ? (
        <div className="space-y-4">
          {jettons.map((jetton, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <img
                  src={jetton.image}
                  alt={jetton.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-xl font-semibold text-gray-100">
                    {jetton.name}
                  </div>
                </div>
              </div>
              <div className="flex text-white text-sm">
                {formatBalance(jetton.balance)}
                <div className="text-sm text-gray-300 ml-1">{jetton.symbol}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
          <p className="text-lg">{t("wallet.noTokensFound")}</p>
        </div>
      )}
    </>
  );
};

export default AssetTab;
