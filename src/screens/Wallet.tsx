import walletImage from "@/assets/wallet.png";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { telegramId } from "../libs/telegram";

const Wallet = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [jettons, setJettons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const tid = String(telegramId);

  const handleWalletConnection = useCallback(
    async (address: string) => {
      setTonWalletAddress(address);
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
    setTonWalletAddress(null);
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

  const formatAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-lg font-bold">
        <p className="animate-bounce text-yellow">Loading your Wallet...</p>
      </div>
    );
  }

  return (
    <div className="flex mx-12 flex-col justify-center items-center min-h-screen ">
      <div className="  rounded-lg p-6 text-center flex flex-col items-center text-white shadow-lg">
        <img src={walletImage} alt="Wallet" className="w-24 mb-6" />
        {tonWalletAddress ? (
          <>
            <p className="mt-2">
              Connected Wallet: <b>{formatAddress(tonWalletAddress)}</b>
            </p>
            <button
              onClick={handleWalletAction}
              className="mt-4 bg-gradient-to-r from-blue-light to-blue-medium text-white py-2 px-6 rounded-md"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Connect Wallet</h2>
            <button
              onClick={handleWalletAction}
              className="mt-4 bg-gradient-to-r from-blue-light to-blue-medium text-white py-2 px-6 rounded-md hover:bg-blue"
            >
              Connect Wallet
            </button>
          </>
        )}
      </div>

      {tonWalletAddress && (
        <div className=" flex flex-col items-center bg-gray-dark p-6 rounded-lg shadow-lg w-full ">
          <p className="text-center text-xl font-bold text-white mb-4">
            Your Tokens
          </p>

        {jettons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
            {jettons.map((jetton, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 text-white rounded-lg shadow-md flex flex-col items-center hover:bg-gray-700 transition-colors"
              >
                <img
                  src={jetton.image}
                  alt={jetton.name}
                  className="w-16 h-16 rounded-full mb-3"
                />
                <p className="font-bold text-lg">{jetton.name}</p>
                <p className="text-sm text-gray-300">
                  Balance: {jetton.balance} {jetton.symbol}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p className="text-lg">No tokens found🤷‍♂️</p>
          </div>
        )}
      </div>
      )}



      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
            <p className="text-white mb-4">Are you sure you want to disconnect?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisconnect}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
