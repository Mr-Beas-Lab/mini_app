import React, { useState, useEffect } from "react";
import TradingViewWidget from "./TradingView";
import BuyToken from "./BuyToken";
import { sethasMRBToken, setLoading } from "@/store/slice/PremiumSlice";
import { useDispatch } from "react-redux";
import { FiMaximize } from "react-icons/fi";

const CryptoAnalyzer: React.FC = () => {
  const dispatch = useDispatch();

  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [timeframe, setTimeframe] = useState<string>("1 Hour");

  const [tempSymbol, setTempSymbol] = useState<string>("BTCUSDT");
  const [tempTimeframe, setTempTimeframe] = useState<string>("1 Hour");

  const [showBuyTokenPopup, setShowBuyTokenPopup] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const checkIfUserHoldsMRBToken = (): boolean => {
    try {
      dispatch(setLoading(true));
      const jettons = localStorage.getItem("jettons");
      dispatch(sethasMRBToken(!!jettons));
      return !!jettons;
    } catch (error) {
      console.error("Error checking user status: ", error);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAnalyze = (event: React.FormEvent) => {
    event.preventDefault();

    if (tempSymbol.trim()) {
      setSymbol(tempSymbol);
      setTimeframe(tempTimeframe);

      if (checkIfUserHoldsMRBToken()) {
        setShowBuyTokenPopup(false); 
       } else {
        setShowBuyTokenPopup(true);
      }
    } else {
      alert("Please enter a valid symbol.");
    }
  };

  const closeBuyTokenPopup = () => {
    setShowBuyTokenPopup(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => {
      document.body.style.overflow = prev ? "auto" : "hidden";
      return !prev;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        toggleFullScreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto"; // Reset overflow on unmount
    };
  }, [isFullScreen]);

  return (
    <section className="flex flex-col items-center  p-4 ">
      <form
        onSubmit={handleAnalyze}
        className="shadow-lg rounded-lg p-4 w-full max-w-lg bg-gray-dark  backdrop-blur-sm space-y-4"
      >
        <h2 className="text-xl text-white font-semibold text-center">
          Advanced Crypto Analyzer
        </h2>

        {/* Chart Section */}
        <div className="relative w-full max-w-3xl">
  {/* Overlay */}
  {!checkIfUserHoldsMRBToken() && (
    <div className="absolute mt-28 inset-0 z-10 flex items-center justify-center bg-black bg-opacity-10">
      <div className="text-gray-400 font-tin text-sm text-center">
        You need to hold MRB Token to interact.
        <button
          className=" rounded-md"
          onClick={() => setShowBuyTokenPopup(true)}
        >
          Buy MRB Token
        </button>
      </div>
    </div>
  )}

  {/* Main Content */}
  <div
    className={`flex justify-between px-4 py-2 bg-gray-dark  text-white ${
      !checkIfUserHoldsMRBToken() ? "pointer-events-none" : ""
    }`}
  >
    <h3 className="text-lg font-semibold">{symbol.toUpperCase()} Analysis</h3>
    <button
      type="button"
      onClick={toggleFullScreen}
      className="text-white hover:text-gray-400 focus:outline-none"
    >
      <FiMaximize size={20} />
    </button>
  </div>

  <div
    className={`h-[225px] ${!checkIfUserHoldsMRBToken() ? "pointer-events-none opacity-50" : ""}`}
  >
    <TradingViewWidget symbol={symbol.toUpperCase()} interval={timeframe} />
  </div>
</div>


        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            {/* Symbol Input */}
            <div className="flex-1">
              <label htmlFor="symbol" className="text-sm text-white block mb-1">
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={tempSymbol}
                onChange={(e) => setTempSymbol(e.target.value)}
                placeholder="e.g., MRBUSDT"
                className="px-3 py-2 w-full border rounded-md focus:ring bg-transparent text-gray-300 focus:ring-blue focus:outline-none"
              />
            </div>

            {/* Timeframe Dropdown */}
            <div className="flex-1">
              <label htmlFor="timeframe" className="text-sm text-white block mb-1">
                Timeframe
              </label>
              <select
                id="timeframe"
                value={tempTimeframe}
                onChange={(e) => setTempTimeframe(e.target.value)}
                className="px-3 py-2 w-full bg-gray-dark text-gray-300 border rounded-md focus:ring text-primary focus:ring-yellow focus:outline-none"
              >
                <option value="1 Hour">1 Hour</option>
                <option value="4 Hours">4 Hours</option>
                <option value="1 Day">1 Day</option>
                <option value="1 Week">1 Week</option>
              </select>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            type="submit"
            className="w-full px-5 bg-gradient-to-r from-blue-light to-blue-medium font-bold text-white py-2 rounded-md hover:bg-yellow-light transition duration-300"
          >
            Analyze
          </button>
        </div>
      </form>

      {/* Fullscreen Modal */}
      {isFullScreen && (
        <div className="fixed backdrop-blur-sm inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="relative w-full h-[95%]">
            <button
              onClick={toggleFullScreen}
              className="absolute top-2 right-4 text-white text-2xl focus:outline-none"
            >
              <FiMaximize size={24} />
            </button>
            <TradingViewWidget symbol={symbol.toUpperCase()} interval={timeframe} />
          </div>
        </div>
      )}

      {/* Display BuyToken Popup if user doesn't hold MRB token */}
      {showBuyTokenPopup && <BuyToken onClose={closeBuyTokenPopup} />}
    </section>
  );
};

export default CryptoAnalyzer;
