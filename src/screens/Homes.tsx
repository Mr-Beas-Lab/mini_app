import CryptoAnalyzer from "../components/home/CryptoAnalayzer"
import HeaderSetting from "@/components/home/HeaderSetting"
// import Profile from "../components/Profile"


export const Homes = () => {
  return (
    <main className="flex flex-col h-auto  ">
      {/* <Profile /> */}
      <HeaderSetting />
       <CryptoAnalyzer />
       
    </main>
  )
}
