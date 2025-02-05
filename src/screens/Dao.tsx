import Profile from "@/components/Profile";
import LeaderBoard from "@/components/LeaderBoard";
import Referral from "@/components/Referral";
import Treasury from "@/components/Treasury";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/stonfi/ui/tab";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";

const Referrals = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("leaderboard");

  return (
    <section className="container mx-auto px-2 py-8">
      <Profile />
      <div className="mt-8">
        <Tabs defaultValue="leaderboard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="relative flex w-full justify-start mb-2 border-b border-border">
            {[
              { value: "treasury", label: t("Treasury.title") },
              { value: "leaderboard", label: t("leaderboard.title") },
              { value: "referral", label: t("referral.subtitle") },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`relative  py-2 text-lg font-medium transition-colors duration-300 ease-in-out ${activeTab === tab.value ? 'text-blue mb-1 font-medium' : 'text-gray-500'}`}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 right-0 bottom-0 h-1 bg-primary rounded-full"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
            <TabsContent value="treasury">
              <Treasury />
            </TabsContent>
            <TabsContent value="leaderboard">
              <LeaderBoard />
            </TabsContent>
            <TabsContent value="referral">
              <Referral />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Referrals;
