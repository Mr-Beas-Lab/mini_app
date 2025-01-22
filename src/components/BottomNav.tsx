import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Import custom icons
import CoinsIcon from "@/assets/icons/referral.svg";
import HomeIcon from "@/assets/icons/hm.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import TrophyIcon from "@/assets/icons/trophy.svg";
import UsersIcon from "@/assets/icons/users.svg";

const BottomNav = () => {
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState("/");

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location]);

  return (
    <footer className=" bottom-0">
      <nav className="fixed w-full px-5 py-3 left-0 bottom-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-around items-center shadow-md">
        <Btn
          icon={<img src={HomeIcon} alt="Home" />}
          currentScreen={currentScreen}
          url="/"
        />
        <Btn
          icon={<img src={CoinsIcon} alt="earn" className="fill-white" />}
          currentScreen={currentScreen}
          url="/earn"
        />
        <Btn
          icon={<img src={WalletIcon} alt="Wallet" />}
          currentScreen={currentScreen}
          url="/airdrops"
        />
        <Btn
          icon={<img src={TrophyIcon} alt="Trophy" />}
          currentScreen={currentScreen}
          url="/daily"
        />
        <Btn
          icon={<img src={UsersIcon} alt="Users" />}
          currentScreen={currentScreen}
          url="/referrals"
        />
        
      </nav>
    </footer>
  );
};

export default BottomNav;

type BtnProps = {
  currentScreen: string;
  url: string;
  icon: React.ReactNode;
};

const Btn = ({ currentScreen, icon, url }: BtnProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(url)}
      className={`flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all duration-300 ${
        currentScreen === url
          ? " border-2 border-gray-500 text-white "
          : "text-white"
      }`}
    >
      {icon}
    </button>
  );
};
