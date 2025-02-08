import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/stonfi/ui/tab"
import { Card, CardContent } from "@/components/stonfi/ui/card"
 import Swap from "./Swap"
 
export default function Defi() {
 
  return (
    <div className="min-h-screen bg-black text-white py-4">
      <Tabs defaultValue="swap" className="w-full max-w-md mx-auto">
        <TabsList className="w-full bg-transparent border-b border-gray-800">
          <TabsTrigger
            value="swap"
            className="text-blue data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
          >
            Swap
          </TabsTrigger>
          <TabsTrigger
            value="pools"
            className="text-gray- data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
          >
            Pools
          </TabsTrigger>
 
        </TabsList>

        <TabsContent value="swap" className="">
          <Card className="">
            <CardContent className="">
              <Swap />

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pools">
          <Card className=" ">
            <CardContent className="p-4">

              <div className="mb-6">
                <h2 className="text-xl font-semibold">Provide liquidity</h2>

              </div>

               available soon...
            </CardContent>
          </Card>
        </TabsContent>
 
      </Tabs>
    </div>
  )
}

