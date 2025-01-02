import React, { useState } from "react";
import TradingViewWidget from "./TradingView";
import BuyToken from "./BuyToken";
import { sethasMRBToken, setLoading } from "@/store/slice/PremiumSlice";
import { useDispatch } from "react-redux";

const CryptoAnalyzer: React.FC = () => {
  const dispatch = useDispatch(); 
  const [symbol, setSymbol] = useState<string>("");
  const [timeframe, setTimeframe] = useState<string>("1 Hour");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showBuyTokenPopup, setShowBuyTokenPopup] = useState<boolean>(false);

  const checkIfUserHoldsMRBToken = (): boolean => {
    try {
      dispatch(setLoading(true));

      const jettons = localStorage.getItem("jettons");
      console.log(jettons)
      if (jettons) {
         
        return true; 
      } else {
 
        dispatch(sethasMRBToken(false));
        return false; 
      }
    } catch (error) {
      console.error("Error checking user status: ", error);
      return false; 
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAnalyze = (event: React.FormEvent) => {
    event.preventDefault();

    if (symbol.trim()) {
      if (checkIfUserHoldsMRBToken()) {
        setShowPopup(true); 
      } else {
        setShowBuyTokenPopup(true); 
      }
    } else {
      alert("Please enter a valid symbol.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeBuyTokenPopup = () => {
    setShowBuyTokenPopup(false);
  };

  return (
    <section className="flex justify-center h-auto bg-gray-dark mx-5 rounded-xl">
      <form onSubmit={handleAnalyze} className="shadow-md rounded-lg p-6 w-96">
        <h2 className="text-lg text-white font-semibold text-center mb-3">
          Advanced Crypto Analyzer
        </h2>
        <div className="flex flex-col text-white">
          <div className="mb-4 w-full">
            <label htmlFor="symbol" className="text-sm">
              Symbol (e.g., BTCUSDT)
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter symbol"
              className="px-4 w-full py-2 border  rounded-md focus:ring bg-transparent text-white focus:ring-blue focus:outline-none"
              required
            />
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="timeframe" className="text-sm">
              Timeframe
            </label>
            <select
              id="timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-4 py-2 bg-gray-dark border rounded-md focus:ring text-primary focus:ring-yellow focus:outline-none"
            >
              <option value="1 Hour">1 Hour</option>
              <option value="4 Hours">4 Hours</option>
              <option value="1 Day">1 Day</option>
              <option value="1 Week">1 Week</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-fit px-10 bg-gradient-to-r from-blue-light to-blue-medium font-bold text-white py-2 rounded-md hover:bg-yellow-light transition duration-300"
          >
            Analyze
          </button>
        </div>
      </form>

      {/* Display TradingView Widget Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-medium text-white rounded-lg shadow-lg w-full h-full p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-center mb-4">
              {symbol.toUpperCase()} Analysis
            </h3>
            <div className="flex-grow">
              <TradingViewWidget symbol={symbol.toUpperCase()} interval={timeframe} />
            </div>
            <button
              onClick={closePopup}
              className="w-full bg-blue text-white py-2 rounded-md hover:bg-red-dark transition duration-300 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Display BuyToken Popup if user doesn't hold MRB token */}
      {showBuyTokenPopup && <BuyToken onClose={closeBuyTokenPopup} />}
    </section>
  );
};

export default CryptoAnalyzer;
