import { Card, CardContent } from "@/components/stonfi/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import FiatTransactions from "./FiatTransactions";
import SendReciveFiat from "./SendReciveFiat";

const FiatWalletTab = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-white w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white">
      {/* Balance Card */}
      <Card className="mb-6 p-6 rounded-lg shadow-md">
        <div className="text-3xl font-bold">
          <h1>0.00 $</h1>
          <small className="text-sm text-gray-300">Your Balance</small>
        </div>
        <SendReciveFiat />
      </Card>

      {/* Transactions Tab */}
      <Tabs defaultValue="remittance" className="w-full">
        <TabsList className="w-full flex gap-3 border-b border-gray-800">
          <TabsTrigger
            value="remittance"
            className="text-gray-400 data-[state=active]:text-blue data-[state=active]:border-b-2 data-[state=active]:border-blue"
          >
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="remittance">
          <Card>
            <CardContent className="p-4">
              <FiatTransactions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FiatWalletTab;
