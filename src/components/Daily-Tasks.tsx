import youtube from '@/assets/youtube.png';

const DailyTasks = () => {
  return (
    <div className="mx-10 sm:mx-[70px] text-white mt-5">
      <h1 className="text-xl sm:text-2xl font-medium">Daily Tasks</h1>
      <div className="flex my-5 justify-between p-4 sm:p-5 rounded-xl bg-gray-dark">
        <div className="flex items-center gap-3">
          <img src={youtube} alt="task" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          <div>
            <p className="text-sm sm:text-base">Subscribe Youtube</p>
            <small className="text-xs sm:text-sm">get +2000 coins</small>
          </div>
        </div>
        <div className="flex items-center">
          <button className="bg-gradient-to-r from-blue-light to-blue-medium px-4 py-2 sm:px-5 sm:py-2 rounded-xl">
            claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
