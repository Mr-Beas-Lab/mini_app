import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";  

const LeaderBoard = () => {
  const { t } = useTranslation();
  const topUsers = useSelector((state: any) => state.topUsers.value);
  const [visibleUsers, setVisibleUsers] = useState(10);
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
    <section className=" mt-6 rounded-lg p-4">
      <h1 className="text-white font-semibold text-xl text-center">
        {t("leaderboard.title")}
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
        <div className="h-full overflow-y-auto mt-3 hide-scrollbar pb-12">
          {topUsers.length === 0 ? (
            <p className="text-white text-center">{t("leaderboard.noUsers")}</p>
          ) : (
            topUsers.slice(0, visibleUsers).map(({ id, balance, firstName, lastName }, idx) => (
              <div key={idx} className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300 font-normal flex-[0.78] truncate">
                      {idx + 1}. {firstName} {lastName}
                    </p>
                    <p className="text-gray-300 font-light flex items-center flex-[0.18] justify-end">
                      {idx < 3 && "🔥"} {balance} <small className="text-[10px]">pts</small>
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

      {/* Load More Button */}
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
