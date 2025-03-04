import { Card, CardContent } from "@/components/stonfi/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import FiatTransactions from "./FiatTransactions";
import FiatAssetTab from "./FiatAssetTab";
import SendReciveFiat from "./SendReciveFiat";

const FiatWalletTab = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulating a loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen py-6">
        <Loader2 className="animate-spin text-white w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  w-full text-white">
      <div className="w-full">
      <Card className="mb-6 p-6 text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
            <div className="text-3xl font-bold w-[60%]">
              <h1>0.00 USDC</h1>
              <small className="text-sm font-thin text-gray-300">Your Balance</small>
            </div>
          </div>
          <SendReciveFiat />
        </Card>
      </div>

      {/* Tabs Section */}
      <div className="w-full">
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="w-full flex gap-3 bg-transparent border-b border-gray-800">
            <TabsTrigger
              value="assets"
              className="text-gray-400 data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
            >
              Assets
            </TabsTrigger>

            <TabsTrigger
              value="remittance"
              className="text-gray-400 data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Assets Tab Content */}
          <TabsContent value="assets" className="h-auto overflow-y-scroll scrollbar-hidden">
            <Card>
              <CardContent className="rounded-lg shadow-md p-4">
                <FiatAssetTab />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remittance Tab Content */}
          <TabsContent value="remittance">
            <Card>
              <CardContent className="p-4">
                <FiatTransactions />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FiatWalletTab;
