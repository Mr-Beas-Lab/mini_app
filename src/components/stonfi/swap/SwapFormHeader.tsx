import { RefreshCw, Settings } from "lucide-react";

import { Button } from "../ui/button";

import { useSwapSimulation } from "@/hooks/swapSimulationQuery";

import { SwapSettings } from "./SwapSettings";
import { useTranslation } from "react-i18next";

export const SwapFormHeader = () => {
  const swapSimulationQuery = useSwapSimulation();
  const { t } = useTranslation();

  return (
    <div className="flex items-center rounded-xl pt-5">
      <h1 className="text-xl leading-8 font-medium mr-auto">
        {t('swap.header.title')}
        </h1>

      <Button
        
        className="size-8 p-0 text-white"
        disabled={
          !swapSimulationQuery.isFetched || swapSimulationQuery.isFetching
        }
        onClick={() => swapSimulationQuery.refetch()}
      >
        <RefreshCw
          size={24}
          className={swapSimulationQuery.isLoading ? "animate-spin" : ""}
        />
      </Button>
      <SwapSettings
        trigger={
          <Button   className="size-8 p-0 text-white">
            <Settings size={24} />
          </Button>
        }
      />
    </div>
  );
};
