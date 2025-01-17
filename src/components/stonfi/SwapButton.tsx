import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "./ui/button";

import { buildSwapTransaction } from "./action/buildSwapTransaction";
import { useSwapSimulation } from "@/hooks/swapSimulationQuery";
import { useSwapStatusNotifications } from "@/hooks/swapStatusNotification";
import { useSwapStatusQuery } from "@/hooks/swapStatusQuery";
 
import { setTransaction } from "@/store/slice/swapTransactionSlice";  
import { RootState } from "@/store/store";
import { setShowMessage } from "@/store/slice/messageSlice";

export function SwapButton() {
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const dispatch = useDispatch();

  // Access Redux state
  const { offerAmount, offerAsset, askAsset, askAmount } = useSelector(
    (state:RootState) => state.swapForm
  );
  const swapSimulationQuery = useSwapSimulation();
  const swapStatusQuery = useSwapStatusQuery();
  const [isClicked, setIsClicked] = useState(false);

  useSwapStatusNotifications();

  const handleSwap = async () => {
    if (!swapSimulationQuery.data || !walletAddress) {
      return;
    }

    try {
      const queryId = Date.now();
      setIsClicked(true);
      const messages = await buildSwapTransaction(
        swapSimulationQuery.data,
        walletAddress,
        {
          queryId,
        }
      );

      await tonConnectUI.sendTransaction({
        validUntil: Date.now() + 1000000,
        messages,
      });
        dispatch(
                setShowMessage({
                message: 'Transaction sent to the network',
                color: 'green',
                })
            );
      // Dispatch transaction details to Redux store
      dispatch(
        setTransaction({
          queryId,
          ownerAddress: walletAddress,
          routerAddress: swapSimulationQuery.data.routerAddress,
        })
      );
    } catch (e) {
      dispatch(setTransaction(null));
    } finally {
      setIsClicked(false);
    }
  };

  if (!walletAddress) {
    return (
      <Button variant="default" onClick={() => tonConnectUI.openModal()}>
        Connect wallet
      </Button>
    );
  }

  if (!offerAsset || !askAsset) {
    return (
      <Button variant="ghost" disabled>
        Select an asset
      </Button>
    );
  }

  if (!offerAmount && !askAmount) {
    return (
      <Button variant="ghost" disabled>
        Enter an amount
      </Button>
    );
  }

  if (swapSimulationQuery.isLoading) {
    return (
      <Button variant="ghost" disabled>
        ...
      </Button>
    );
  }

  if (!swapSimulationQuery.data) {
    return <Button variant="destructive">Invalid swap</Button>;
  }

  return (
    <Button
       className="my-4 bg-gradient-to-r items-center w-fit from-blue-light to-blue-medium text-white py-1 px-6 rounded-md"
      onClick={handleSwap}
      disabled={
        isClicked ||
        swapSimulationQuery.isFetching ||
        swapStatusQuery.isFetching
      }
    >
      Swap
    </Button>
  );
}
