import { SwapForm } from "@/components/stonfi/swap/SwapForm";
// import SwapIcon from "@/assets/icons/swapIcon.svg";
import BottomNav from "@/components/BottomNav";

export default function Swap() {

  return (
    <section className="px-5 py-4 w-full pt-4 md:pt-12 flex flex-col gap-4 mb-16">

{/* 
      Swap Icon
      <div className="flex justify-center align-middle my-10">
        <img src={SwapIcon} alt="Swap Icon" className="w-10 h-10" />
      </div> */}

      {/* Swap Form */}
      <SwapForm />

      {/* Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
