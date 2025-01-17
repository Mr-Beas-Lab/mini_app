import { SwapForm } from "@/components/stonfi/SwapForm";
import SwapIcon from "@/assets/icons/swapIcon.svg";
import { BiArrowBack } from "react-icons/bi";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Swap() {
  const navigate = useNavigate();

  return (
    <section className="px-5 py-4 w-full pt-4 md:pt-12 flex flex-col gap-4 mb-16">
      {/* Back Icon */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="flex items-center gap-2 text-gray-200 transition"
        >
          <BiArrowBack size={24} />  
          <span className="font-medium text-lg">Back</span>
        </button>
      </div>

      {/* Swap Icon */}
      <div className="flex justify-center align-middle my-10">
        <img src={SwapIcon} alt="Swap Icon" />
      </div>

      {/* Swap Form */}
      <SwapForm />

      {/* Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
