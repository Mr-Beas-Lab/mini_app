
import walletImage from "@/assets/wallet.png";
import { useTonConnectUI } from "@tonconnect/ui-react";

import { useCallback, useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { telegramId } from "../libs/telegram";
import { useDispatch, useSelector } from "react-redux";
import { clearWallet, setTonWalletAddress } from "@/store/slice/walletSlice";
import { formatAddress } from "@/libs/formatAddress";
import  {formatBalance}  from "@/libs/formatBalance";
import {  Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

const Wallet = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [jettons, setJettons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("leaderboard");

  const tid = String(telegramId);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { tonWalletAddress } = useSelector((state: any) => state.wallet);
 
  const handleWalletConnection = useCallback(
    async (address: string) => {
      dispatch(setTonWalletAddress(address));
      console.log("Wallet connected:", address);
      setIsLoading(false);

      try {
        const userRef = doc(db, "users", tid);
        await updateDoc(userRef, {
          walletAddress: address,
        });
      } catch (error) {
        console.error("Error updating wallet address in Firebase:", error);
      }
    },
    [tid]
  );

  const handleWalletDisconnect = useCallback(async () => {
    dispatch(clearWallet());
    setIsLoading(false);

    try {
      localStorage.removeItem("jettons");

      const userRef = doc(db, "users", tid);
      await updateDoc(userRef, {
        walletAddress: null,
      });
    } catch (error) {
      console.error("Error resetting wallet address in Firebase:", error);
    }
  }, [tid]);

  const handleConfirmDisconnect = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    await tonConnectUI.disconnect();
  };

  useEffect(() => {
  //  // MRB contract address in RAW (HEX) format
  //     const MRB_CONTRACT_ADDRESS_RAW =
  //     "0:b5f322c4e4077bd559ed708c1a32afcfc005b5a36fb4082a07fec4df71d45cee";

    const fetchJettons = async (address: string) => {
      try {
        const url = `https://tonapi.io/v2/accounts/${address}/jettons?currencies=ton`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          const parsedJettons = data.balances
            .map((jetton: any) => ({
              address: jetton.jetton.address,
              name: jetton.jetton.name,
              symbol: jetton.jetton.symbol,
              image: jetton.jetton.image,
              balance: jetton.balance,
            }))

          localStorage.setItem("jettons", JSON.stringify(parsedJettons));
          setJettons(parsedJettons);
        } else {
          console.error("Failed to fetch jettons");
        }
      } catch (error) {
        console.error("Error fetching jettons:", error);
      }
    };

    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        await handleWalletConnection(tonConnectUI.account.address);
        fetchJettons(tonConnectUI.account.address);
      } else {
        await handleWalletDisconnect();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
        fetchJettons(wallet.account.address);
      } else {
        handleWalletDisconnect();
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnect]);

  const handleWalletAction = async () => {
    if (tonWalletAddress) {
      setShowConfirmModal(true);
    } else {
      await tonConnectUI.openModal();
    }
  };



  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-lg font-bold">
        <p className="animate-bounce text-yellow">{t('wallet.loading')}</p>
      </div>
    );
  }

  return (
<div
  className="flex w-full h-[88vh] flex-col  items-center border-b border-gray-800 pb-10  overflow-x-auto overflow-y-hidden scrollbar-hidden relative no-scrollbar "
>     
    <div className="rounded-lg py-6 text-center flex flex-col  text-white shadow-lg">
    <div className="bg-gray-dark rounded-lg py-5 shadow-lg w-[300px] px-4 ">
        <div className="flex ">
          <h1 className="text-3xl">$00.00</h1>
          <img src={walletImage} alt="Wallet" className="w-3 h-3 mt-4" />
        </div>

      {tonWalletAddress ? (
        <>

          <p className="mt-2">
            {t('wallet.connectedWallet')} <b>{formatAddress(tonWalletAddress)}</b>
          </p>
          <button
            onClick={handleWalletAction}
            className="mt-4 bg-gradient-to-r from-blue-light to-blue-medium text-white py-2 px-6 rounded-md"
          >
            {t('wallet.disconnectButton')}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{t('wallet.connectTitle')}</h2>
          <button
            onClick={handleWalletAction}
            className="mt-4 bg-gradient-to-r from-blue-light to-blue-medium text-white py-2 px-6 rounded-md hover:bg-blue"
          >
            {t('wallet.connectButton')}
          </button>
        </>
      )}
    </div>
    </div>
    {tonWalletAddress && (
      <div className="flex flex-col items-center p-6 rounded-lg shadow-lg w-full">
        <div className="   w-full">
          <Tabs defaultValue="assets" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="relative flex w-full border-b border-gray-dark">
              {[
                { value: "assets", label: "Assets" },
                { value: "activity", label: "Activity" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`relative py-2 px-4 text-lg font-medium transition-all duration-300 ${
                    activeTab === tab.value ? "text-blue font-semibold" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-blue"
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-hidden relative no-scrollbar p-4">
              <TabsContent value="assets" className="mb-16">
                {jettons.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {jettons.map((jetton, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                      >
                        <img src={jetton.image} alt={jetton.name} className="w-8 h-8 rounded-full" />
                        <span className="text-white font-medium">
                          {formatBalance(jetton.balance)} {jetton.symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <p className="text-lg">{t("wallet.noTokensFound")}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mb-16 flex justify-center items-center h-40 text-gray-500">
                <p className="text-lg">Coming soon</p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    )}




      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
          <p className="text-white mb-4">{t('wallet.modal.confirmDisconnect')}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-dark  text-white py-2 px-4 rounded-lg"
              >
              {t('wallet.modal.cancel')}
              </button>
              <button
                onClick={handleConfirmDisconnect}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
              {t('wallet.modal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
            <Outlet />

    </div>
  );
};

export default Wallet;
