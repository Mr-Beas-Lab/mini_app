import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";  
import leaderImg from "@/assets/icons/leader.svg"
const LeaderBoard = () => {
  const { t } = useTranslation();
  const topUsers = useSelector((state: any) => state.topUsers.value);
  const [visibleUsers, setVisibleUsers] = useState(15);
  const [loading, setLoading] = useState(true); // Loading for initial fetch
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (topUsers.length > 0) {
      setLoading(false); // Stop loading once data is available
    }
  }, [topUsers]);

  const loadMoreUsers = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      setVisibleUsers((prev) => prev + 7);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <section className="   mt-6 rounded-lg p-2  m-2">
      <h1 className=" flex justify-center ">
        <img src={leaderImg} alt=""  className="w-12 h-12 mb-3"/>
      </h1>
      <small className="text-gray-400 flex justify-center text-center">
        {t("leaderboard.subtitle")}
      </small>

      {/* Show loading spinner before fetching data */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      ) : (
        <div className="  mt-3   pb-12 ">
          {topUsers.length === 0 ? (
            <p className="text-white text-center">{t("leaderboard.noUsers")}</p>
          ) : (
            topUsers.slice(0, visibleUsers).map(({ id, balance, firstName, lastName }, idx) => (
              <div key={idx} className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300 font-normal flex-[0.50] truncate">
                      {idx + 1}. {firstName} {lastName}
                    </p>
                    <p className="text-gray-300 font-light flex items-center align-middle  flex-nowrap">
                      {idx < 3 && "🔥"}{balance} <small className="text-sm pl-1"> pts</small>
                    </p>
                  </div>

                {/* Add subtle line between users */}
                {idx < visibleUsers - 1 && (
                  <hr className="border-gray-700 my-2 opacity-50" />
                )}
              </div>
            ))
          )}
        </div>
      )}

       {topUsers.length > visibleUsers && (
        <div className="flex justify-center mt-4 pb-4">
          <button
            onClick={loadMoreUsers}
            className="bg-blue text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 hover:bg-opacity-80 disabled:opacity-50"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> {t("leaderboard.loadingMore")}
              </>
            ) : (
              t("leaderboard.loadMore")
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default LeaderBoard;
