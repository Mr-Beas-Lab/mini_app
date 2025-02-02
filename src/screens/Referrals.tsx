import Profile from "@/components/Profile";
import LeaderBoard from "@/components/LeaderBoard";
import Referral from "@/components/Referral";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useTranslation } from 'react-i18next';

const Referrals = () => {
  const { t } = useTranslation();

  return (
    <section className="mb-24">
      <Profile />
      <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
        <Tabs defaultValue="leaderboard" className="w-full max-w-lg">
          <TabsList className="flex w-full bg-zinc-900 p-1 rounded-lg shadow-md">
          <TabsTrigger
              value="leaderboard"
              className="w-1/2 py-2 text-center text-lg font-medium rounded-md transition-all duration-300 
                         hover:bg-zinc-800 focus:bg-zinc-700 data-[state=active]:bg-zinc-600"
            >
              {t("leaderboard.title")}

            </TabsTrigger>

            <TabsTrigger
              value="referral"
              className="w-1/2 py-2 text-center text-lg font-medium rounded-md transition-all duration-300 
                         hover:bg-zinc-800 focus:bg-zinc-700 data-[state=active]:bg-zinc-700"
            >
              
              {t("referral.subtitle")}

            </TabsTrigger>

          </TabsList>
          <div className="mt-6 p-4 bg-zinc-900 rounded-lg shadow-lg w-full">
            <TabsContent value="referral">
              <Referral />
            </TabsContent>
            <TabsContent value="leaderboard">
              <LeaderBoard />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Referrals;
