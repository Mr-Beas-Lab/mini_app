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
    <section className="h-screen overflow-auto scrollbar-hidden">
      <Profile />
      <div className="mt-8">
        <Tabs defaultValue="leaderboard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="relative flex w-full  ">
            {[
              { value: "treasury", label: t("Treasury.title") },
              { value: "leaderboard", label: t("leaderboard.tabTitle") },
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
                     initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="overflow-y-auto max-h-[calc(100vh-150px)] ">
          <TabsContent value="treasury" className="mb-[120px]">
              <Treasury />
            </TabsContent>
            <TabsContent value="leaderboard" className="mb-[120px]">
              <LeaderBoard />
            </TabsContent>
            <TabsContent value="referral" className="mb-[120px]">
              <Referral />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Referrals;
