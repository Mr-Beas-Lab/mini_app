// import rank from "@/assets/rank.png";
import LeaderBoard from "@/components/LeaderBoard";
import Profile from "@/components/Profile";

const Rank = () => {
  return (
    <section className="mb-24 h-[75%] overflow-hidden">
      {/* <div className="rounded-xl mt-5 bg-gradient-to-t from-blue-medium to-blue-light h-[150px] flex justify-between items-center mx-6 sm:mx-12 px-4 sm:px-5">
        <aside className="text-white">
          <h1 className="text-2xl sm:text-3xl font-semibold">Rank</h1>
          <p className="text-sm sm:text-base">Complete tasks and earn rewards!</p>
        </aside>
        <aside className="flex justify-end">
          <img src={rank} alt="Rank" className="w-24 h-24 sm:w-32 sm:h-32" />
        </aside>
      </div> */}
      <Profile />
      {/* Leaderboard Section */}
      <LeaderBoard />
    </section>
  );
};

export default Rank;
