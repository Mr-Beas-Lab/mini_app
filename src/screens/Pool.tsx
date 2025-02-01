import BottomNav from "@/components/BottomNav"
import LiqudityForm from "@/components/stonfi/liqudity/LiqudityForm"
import { LiqudityFormHeader } from "@/components/stonfi/liqudity/liqudityFormHeader"
  
const Pool = () => {
  return (
    <>
        <LiqudityFormHeader/>
        <LiqudityForm />
         <BottomNav />   
    </>
  )
}

export default Pool