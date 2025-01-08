
import { TonConnectButton } from "@tonconnect/ui-react";
import { useSelector } from "react-redux";

export function Header() {
  const tonWalletAddress = useSelector((state: any) => state.wallet.tonWalletAddress)

  return (
    <header className="sticky bg-gray-dark top-0 px-5 flex h-16 items-center gap-4 border-b justify-between">
      <h1 className="text-2xl text-white font-semibold">Stonfi</h1>
      <section className="container flex justify-end items-center gap-4">
         
        {tonWalletAddress ? tonWalletAddress :
          <TonConnectButton />
        }

      </section>
    </header>
  );
}