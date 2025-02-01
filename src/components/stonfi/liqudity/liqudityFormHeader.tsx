import { RefreshCw, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useSwapSimulation } from "@/hooks/swapSimulationQuery";
import { LiquditySettings } from "./LiquditySettings";

export const LiqudityFormHeader = () => {
  const swapSimulationQuery = useSwapSimulation();
 
  return (
    <div className="flex items-center rounded-xl p-4 gap-2">
      <h1 className="text-xl leading-8 font-medium mr-auto">
         add Liqudity
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
      <LiquditySettings
        trigger={
          <Button   className="size-8 p-0 text-white">
            <Settings size={24} />
          </Button>
        }
      />
    </div>
  );
};
