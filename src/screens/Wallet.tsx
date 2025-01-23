
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
import { Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

const Wallet = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [jettons, setJettons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
   // MRB contract address in RAW (HEX) format
      const MRB_CONTRACT_ADDRESS_RAW =
      "0:b5f322c4e4077bd559ed708c1a32afcfc005b5a36fb4082a07fec4df71d45cee";

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
            .filter(
              (jetton: any) => jetton.address === MRB_CONTRACT_ADDRESS_RAW
            ); // Filter by specific contract address

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
      <div className="flex min-h-screen flex-col items-center justify-center text-lg font-bold">
        <p className="animate-bounce text-yellow">{t('wallet.loading')}</p>
      </div>
    );
  }

  return (
<div
  className="flex w-full h-screen flex-col justify-center items-center "
>       <div className="rounded-lg p-6 text-center flex flex-col items-center text-white shadow-lg">
      <img src={walletImage} alt="Wallet" className="w-16 mb-6" />
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

      {tonWalletAddress && (
         <div className=" flex flex-col items-center   p-6 rounded-lg shadow-lg w-full ">
 
 
          {jettons.length > 0 ? (
        <div>
          {jettons.map((jetton, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow-md flex flex-col justify-center items-center"
            >
              <img
                src={jetton.image}
                alt={jetton.name}
                className="w-16 h-16 rounded-full mb-3"
              />
              <p className="text-center text-lg text-white mb-4">
                {t('wallet.tokenBalanceTitle')} <br />
                <span className="text-sm font-normal text-gray-300">
                  {formatBalance(jetton.balance) + " " + jetton.symbol}
                </span>
              </p>
              <button className="bg-gradient-to-r from-blue-light to-blue-medium text-white py-2 px-6 rounded-md mb-10">
                <Link to="/swap">
                  {t('wallet.tokenSwapButton')}
                </Link>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <p className="text-lg">{t('wallet.noTokensFound')}</p>
        </div>
      )}
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
