import CryptoAnalyzer from "../components/CryptoAnalayzer"
import HeaderSetting from "@/components/HeaderSetting"
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
