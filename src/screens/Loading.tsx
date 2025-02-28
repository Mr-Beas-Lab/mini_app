import { Loader2 } from "lucide-react";  

const Loading = () => {
  return (
 
    <div className="flex items-center justify-center h-screen w-screen fixed overflow-hidden bg-gray-deep">
      <div className="flex flex-col items-center">
        <Loader2 className="text-5xl text-blue animate-spin" />
      </div>
    </div>
  )
}

export default Loading