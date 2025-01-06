import React, { useState } from "react";
import TradingViewWidget from "./TradingView";
import BuyToken from "./BuyToken";
import { sethasMRBToken, setLoading } from "@/store/slice/PremiumSlice";
import { useDispatch } from "react-redux";
import oip from "@/assets/OIP (2).jpg";
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
 
    <section className="flex justify-center mt-8 h-auto bg-gray-dark mx-4 rounded-xl p-4">
  <form onSubmit={handleAnalyze} className="shadow-lg rounded-lg p-4 w-full max-w-lg bg-gray-800">
    <h2 className="text-xl text-white font-semibold text-center mb-4">
      Advanced Crypto Analyzer
    </h2>

    {/* Token Info Section */}
    <div className="flex flex-col items-center mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">MRBUSD Token</h3>
      <p className="text-xs text-gray-400 mb-3">Real-time analysis and trading chart</p>
      <img
        src={oip}
        alt="MRB Token Chart"
        className="w-[200px] h-[120px] object-cover rounded-md shadow-md"
      />
    </div>

    {/* Symbol and Timeframe Inputs in one row for larger screens */}
    <div className="flex flex-col sm:flex-row sm:gap-4 mb-5">
      {/* Symbol Input */}
      <div className="sm:flex-1 mb-3 sm:mb-0">
        <label htmlFor="symbol" className="text-sm text-white block mb-1">Symbol</label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g., MRBUSDT"
          className="px-3 py-2 w-full border rounded-md focus:ring bg-transparent text-white focus:ring-blue focus:outline-none"
          required
        />
      </div>

      {/* Timeframe Dropdown */}
      <div className="sm:flex-1">
        <label htmlFor="timeframe" className="text-sm text-white block mb-1">Timeframe</label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 w-full bg-gray-dark border rounded-md focus:ring text-primary focus:ring-yellow focus:outline-none"
        >
          <option value="1 Hour">1 Hour</option>
          <option value="4 Hours">4 Hours</option>
          <option value="1 Day">1 Day</option>
          <option value="1 Week">1 Week</option>
        </select>
      </div>
    </div>

    {/* Analyze Button */}
    <div className="flex justify-center mt-3">
      <button
        type="submit"
        className="w-full px-5 bg-gradient-to-r from-blue-light to-blue-medium font-bold text-white py-2 rounded-md hover:bg-yellow-light transition duration-300"
      >
        Analyze
      </button>
    </div>
  </form>

  {/* Display TradingView Widget Popup */}
  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-medium text-white rounded-lg shadow-lg w-[90%] sm:w-[80%] h-[80%] p-4 flex flex-col">
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
