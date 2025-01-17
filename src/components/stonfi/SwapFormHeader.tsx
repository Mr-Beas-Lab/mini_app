import { RefreshCw, Settings } from "lucide-react";

import { Button } from "./ui/button";

import { useSwapSimulation } from "@/hooks/swapSimulationQuery";

import { SwapSettings } from "./SwapSettings";

export const SwapFormHeader = () => {
  const swapSimulationQuery = useSwapSimulation();

  return (
    <div className="flex items-center rounded-xl p-4 gap-2">
      <h1 className="text-xl leading-8 font-medium mr-auto">Swap Token</h1>

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
