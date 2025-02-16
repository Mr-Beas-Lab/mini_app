import { SwapForm } from "@/components/stonfi/swap/SwapForm";
// import { TadsWidget } from 'react-tads-widget';
import BottomNav from "@/components/BottomNav";

export default function Swap() {

  return (
    <section className=" mb-16">

      {/* <div className="container h-[150px]">
            <TadsWidget id="355" debug={false}  />
      </div> */}

      {/* Swap Form */}
      <SwapForm />

      {/* Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
