import Ad from "../components/Ad"
import CryptoAnalyzer from "../components/CryptoAnalayzer"
import Profile from "../components/Profile"


export const Homes = () => {
  return (
    <main className="flex flex-col mb-24 ">
      <Profile />
      <Ad />
      <CryptoAnalyzer />
    </main>
  )
}
