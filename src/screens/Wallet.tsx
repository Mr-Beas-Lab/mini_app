
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";

import { useCallback, useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { telegramId } from "../libs/telegram";
import { useDispatch, useSelector } from "react-redux";
import { clearWallet, setTonWalletAddress } from "@/store/slice/walletSlice";
import  {formatBalance}  from "@/libs/formatBalance";
import {  Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import MyTonWallet from "@/components/wallet/SimulationWallet";
import { Card, CardContent } from "@/components/stonfi/ui/card";
import SendReceive from "@/components/wallet/SendReceive";

const Wallet = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [jettons, setJettons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);

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

 

  useEffect(() => {
    if (tonWalletAddress) {
      getBalance();
    }
  }, [tonWalletAddress, Wallet]);
  const url = `https://toncenter.com/api/v2/getAddressInformation?address=${tonWalletAddress}`;

  const getBalance = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      const res = await response.json();
      console.log(res.result.balance);
      setWalletBalance(parseFloat(res.result.balance) / 1e9);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setWalletBalance(0);
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
      className="flex w-full h-[88vh] flex-col border-b border-gray-800 pb-10 overflow-x-auto overflow-y-hidden scrollbar-hidden relative no-scrollbar"
    >
      {!tonWalletAddress && <MyTonWallet />}
  
      {tonWalletAddress && (
        <div className="min-h-screen p-4 w-full text-white">
          <div className="w-full">
          <Card className="mb-6 p-6 text-white rounded-lg shadow-md">
              <div className="mb-6 flex justify-between items-center">
                <div className="text-3xl font-bold w-[60%]">
                  {walletBalance.toFixed(2)} TON <br/>
                  <small className="text-sm font-thin text-gray-300"> Your Balance</small>
                </div>
                <TonConnectButton className="p-2  rounded-lg shadow-md" />
              </div>
              <SendReceive />
            </Card>

          </div>
  
          <div className="w-full ">
            <Tabs defaultValue="assets" className="w-full">
              <TabsList className="w-full flex gap-3 bg-transparent border-b border-gray-800">
                <TabsTrigger
                  value="assets"
                  className="text-gray data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
                >
                  Assets
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="text-gray data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
  
              <TabsContent value="assets" className="h-[270px] overflow-y-scroll scrollbar-hidden">
                <Card>
                  <CardContent className="rounded-lg shadow-md p-4">
                    {jettons.length > 0 ? (
                      <div className="space-y-4">
                        {jettons.map((jetton, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <img src={jetton.image} alt={jetton.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <div className="text-xl font-semibold text-gray-100">{jetton.name}</div>
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
                  </CardContent>
                </Card>
              </TabsContent>
  
              <TabsContent value="activity">
                <Card>
                  <CardContent className="text-center text-gray-400 py-8">No recent activity</CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
  
      <Outlet />
    </div>
  );
  
};

export default Wallet;
