import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../ui/button";

import { buildSwapTransaction } from "../action/buildSwapTransaction";
import { useSwapSimulation } from "@/hooks/swapSimulationQuery";
import { useSwapStatusNotifications } from "@/hooks/swapStatusNotification";
import { useSwapStatusQuery } from "@/hooks/swapStatusQuery";

import { setTransaction } from "@/store/slice/swapTransactionSlice";
import { RootState } from "@/store/store";
import { setShowMessage } from "@/store/slice/messageSlice";
import { useTranslation } from "react-i18next";

export function SwapButton() {
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const dispatch = useDispatch();
  const { t } = useTranslation(); 

  // Access Redux state
  const { offerAmount, offerAsset, askAsset, askAmount } = useSelector(
    (state: RootState) => state.swapForm
  );
  const swapSimulationQuery = useSwapSimulation();
  const swapStatusQuery = useSwapStatusQuery();
  const [swapStatus, setSwapStatus] = useState<string | null>(null);

  useSwapStatusNotifications();

  const handleSwap = async () => {
    if (!swapSimulationQuery.data || !walletAddress) {
      return;
    }

    try {
      const queryId = Date.now();
      setSwapStatus(t("swap.buildingTransaction"));
      const messages = await buildSwapTransaction(
        swapSimulationQuery.data,
        walletAddress,
        {
          queryId,
        }
      );

      setSwapStatus(t("swap.sendingTransaction"));
      await tonConnectUI.sendTransaction({
        validUntil: Date.now() + 1000000,
        messages,
      });

      setSwapStatus(t("swap.transactionSent"));
      dispatch(
        setShowMessage({
          message: t("swap.transactionSent"),
          color: "green",
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
      setSwapStatus(t("swap.transactionFailed"));
      dispatch(setTransaction(null));
      dispatch(
        setShowMessage({
          message: t("swap.transactionFailed"),
          color: "red",
        })
      );
    } finally {
      setTimeout(() => setSwapStatus(null), 2000); // Reset status after 2 seconds
    }
  };

  if (!walletAddress) {
    return (
      <Button variant="default" onClick={() => tonConnectUI.openModal()}>
        {t("swap.connectWallet")}
      </Button>
    );
  }

  if (!offerAsset || !askAsset) {
    return (
      <Button variant="ghost" disabled>
        {t("swap.selectAsset")}
      </Button>
    );
  }

  if (!offerAmount && !askAmount) {
    return (
      <Button variant="ghost" disabled>
        {t("swap.enterAmount")}
      </Button>
    );
  }

  if (swapSimulationQuery.isLoading) {
    return (
      <Button variant="ghost" disabled>
        {t("swap.loading")}
      </Button>
    );
  }

  if (!swapSimulationQuery.data) {
    return <Button variant="destructive">{t("swap.invalidSwap")}</Button>;
  }

  return (
    <Button
      className="my-4 bg-gradient-to-r items-center w-fit from-blue-light to-blue-medium text-white py-1 px-6 rounded-md"
      onClick={handleSwap}
      disabled={swapSimulationQuery.isFetching || swapStatusQuery.isFetching}
    >
      {swapStatus || t("swap.defaultSwap")}
    </Button>
  );
}
