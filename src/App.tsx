import { Route, Routes } from "react-router-dom";
import Loading from "./screens/Loading";
import { Homes } from "./screens/Homes";
import Referrals from "./screens/Dao";
import Earn from "./screens/Earn";
import Daily from "./screens/Defi";
import Airdrop from "./screens/Wallet";

// Firebase Firestore
import { collection, doc, getDocs, onSnapshot, query, orderBy, setDoc } from "firebase/firestore";
import { db } from "./firebase";  

//telegram user info import
import { telegramId } from "@/libs/telegram";
import { userName } from "@/libs/telegram";
import { firstName } from "@/libs/telegram";
import { lastName } from "@/libs/telegram";
import { languageCode } from "@/libs/telegram";

//Redux Actions and Selectors
import { setTopUsers } from "@/store/slice/topUsersSlice";
import { setUser } from "@/store/slice/userSlice";
import { selectShowMessage, setShowMessage } from "@/store/slice/messageSlice";
import { selectUser } from "@/store/slice/userSlice";
import { selectCalculate } from "@/store/slice/calculateSlice";
import { AppDispatch, RootState } from "@/store/store";  
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "@/components/BottomNav";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";


//analytics
import { useLocation } from 'react-router-dom'; 
import { initGA, trackPageView } from './analytics'; 
import Swap from "./screens/Swap";
import Pool from "./screens/Pool";

function App() {
 
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const user = useSelector((state: RootState) => selectUser(state));
  const calculate = useSelector((state: RootState) => selectCalculate(state));
  const message = useSelector((state: RootState) => selectShowMessage(state));
 
  const location = useLocation(); // Get current location (URL)

  useEffect(() => {
    initGA(); 

    // Track page views when the location (URL) changes
    trackPageView(location.pathname + location.search);

  }, [location]); // The effect runs every time the location changes

    // Fetch user data from Firestore
    useEffect(() => {
      const getUser = () => {
         
        const unSub = onSnapshot(doc(db, "users", String(telegramId)), async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(
              setUser({
                uid: data.id,
                userImage: data.userImage,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                languageCode: data.languageCode,
                referrals: data.referrals || {},
                referredBy: data.referredBy || null,
                isPremium: data.isPremium || false,
                balance: data.balance || 0,
                
                daily: {
                  claimedTime: data.daily?.claimedTime
                    ? data.daily.claimedTime.toMillis()
                    : null,
                  claimedDay: data.daily?.claimedDay || 0,
                },
                walletAddress:data.walletAddress,
              })
            );
          } else {
            await setDoc(doc(db, "users", String(telegramId)), {
              firstName: firstName,
              lastName: lastName || null,
              username: userName || null,
              languageCode: languageCode,
              referrals: {},
              referredBy: null,
              balance: 0,
              mineRate: 0.001,
              isMining: false,
              miningStartedTime: null,
              daily: {
                claimedTime: null,
                claimedDay: 0,
              },
              walletAddress: null,
            });
          }
        });
        return unSub;
      };
  
      return getUser();
    }, [dispatch]);
  
    // Fetch top users
    useEffect(() => {
      const fetchTopUsers = async () => {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, orderBy("balance", "desc"));
          const querySnapshot = await getDocs(q);
          const topUsers = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            balance: docSnap.data().balance,
            userImage: docSnap.data().userImage,
            firstName: docSnap.data().firstName,
            lastName: docSnap.data().lastName,
          }));
          dispatch(setTopUsers(topUsers));
        } catch (error) {
          console.error("Error fetching top users:", error);
        }
      };
  
      fetchTopUsers();
    }, [dispatch]);
  
    // Show message as toast
    useEffect(() => {
      if (message) {
        toast(message.message, {
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: false,
        });
        dispatch(setShowMessage(null));
      }
    }, [message, dispatch]);
  return (
  <>
    {user && calculate && <BottomNav />}
    { <BottomNav />}
      <ToastContainer
        style={{
          width: "calc(100% - 40px)",
          maxWidth: "none",
          left: "20px",
          right: "20px",
          top: "30px",
          height: "80px",
        }}
        toastStyle={{
          minHeight: "20px",
          padding: "0px 10px",
          paddingBottom: "4px",
          backgroundColor: message?.color || "#00c000",
          color: "white",
          borderRadius: "6px",
          marginBottom: "4px",
        }}
      />
    <Routes>
      <Route path="*" element={<Loading />} />
      <Route path="/" element={<Homes />} />
      <Route path="/referrals" element={<Referrals/>} />
      <Route path="/earn" element={<Earn />} />
      <Route path="/defi" element={<Daily />} />
      {/* Layout component wraps the pages */}
      {/* <Route element={<Layout />}> */}
        {/* Nested routes under Layout, which includes BottomNav */}
        <Route path="/airdrops" element={<Airdrop />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/pool" element={<Pool />} />
        <Route path="/addliqudity" element={<Pool />} />
      {/* </Route> */}
    </Routes>
  </>
  )
}

export default App
