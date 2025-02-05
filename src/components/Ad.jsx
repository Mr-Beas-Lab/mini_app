import   { useState, useEffect } from "react";
import { Video, CheckCircle } from "lucide-react";  
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";  
import { useDispatch } from "react-redux";
import { setShowMessage } from "../store/slice/messageSlice";  
import { telegramId } from "@/libs/telegram";

const Ad = () => {
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [canClaim, setCanClaim] = useState(false);
  const [claimDisabled, setClaimDisabled] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdVisible) {
      // Start countdown when the ad becomes visible
      let timeLeft = 15;
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
        timeLeft -= 1;
 
        if (timeLeft <= 0) {
          clearInterval(timer);
          setCanClaim(true);
        }
      }, 1000);
 
      // Append ad script only when ad is shown
      if (window.show_8869778) {
        window.show_8869778().then(() => {
          console.log("Ad displayed!");
        });
      } else {
        const script = document.createElement("script");
        script.src = "//whephiwums.com/vignette.min.js";
        script.dataset.zone = "8869778";
        script.dataset.sdk = "show_8869778";
        document.body.appendChild(script);
      }
   
      return () => clearInterval(timer); // Cleanup timer
    }
  }, [isAdVisible]);
  
 
  const showAd = () => {
    setIsAdVisible(true);
  };

  const claimReward = async () => {
    if (canClaim) {
      try {
        setClaimDisabled(true);
        const tid = String(telegramId)
        const userId =  tid
        const userRef = doc(db, "users", userId);
console.log(tid, userRef)
        // Fetch current user data
        const userDocSnapshot = await getDoc(userRef);
        const userData = userDocSnapshot.data();

        if (userData && userData.balance !== undefined) {
          const newBalance = userData.balance + 10; // Add 10 points

          // Update the user's balance in the database
          await updateDoc(userRef, {
            balance: newBalance,
            lastClaimed: serverTimestamp(), // Optional: store the last claimed time if needed
          });

          // Display success message
          dispatch(
            setShowMessage({
              message: "✅ 10 Points Added!",
              color: "green",
            })
          );

          // Reset ad state
          setIsAdVisible(false);
          setCountdown(15);
          setCanClaim(false);
        } else {
          throw new Error("User data not found or balance is invalid.");
        }
      } catch (error) {
        console.error("Error claiming reward:", error);
        dispatch(
          setShowMessage({
            message: "❌ Task Not Completed. Please try again.",
            color: "red",
          })
        );
      } finally {
        setClaimDisabled(false);
      }
    }
  };

  return (
    <div
      className="w-full p-5 rounded-xl shadow-md relative overflow-hidden text-white flex flex-col items-center justify-center gap-3"
       
    >
      {!isAdVisible ? (
        <button
          onClick={showAd}
          className="flex items-center justify-center gap-3 px-5 py-3 bg-gray-dark text-white font-semibold text-sm rounded-lg transition-all hover:bg-gray-700"
        >
          <Video className="w-5 h-5 text-yellow-400 animate-pulse" />
          Watch Ad & Get Reward
        </button>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-white text-sm">Ad is now playing...</p>
          <p className="text-gray-300 text-xs">⏳ Please wait {countdown}s...</p>
          {!canClaim ? (
            <div className="w-full py-2 text-center text-white">
              {/* Ad content goes here. It can be a video or banner */}
              <div id="ad-container" className="w-full">
                {/* Actual Ad will be displayed here */}
                {/* Ad script will dynamically load it */}
              </div>
            </div>
          ) : (
            <button
              onClick={claimReward}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-light to-blue-medium  text-white font-semibold text-sm rounded-lg transition-all "
              disabled={claimDisabled}
            >
              <CheckCircle className="w-5 h-5 text-white" />
              Claim 10 Points
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Ad;
