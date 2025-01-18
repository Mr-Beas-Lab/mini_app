import { telegramId } from "@/libs/telegram";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LeaderBoard = () => {
  const { t } = useTranslation();  
  const topUsers = useSelector((state: any) => state.topUsers.value);
  const [visibleUsers, setVisibleUsers] = useState(7);
  const [loading, setLoading] = useState(false);

  const loadMoreUsers = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      setVisibleUsers((prev) => prev + 7);
      setLoading(false);
    }, 500);
  };

  return (
    <section className="bg-gray-dark mt-6 rounded-lg mx-6 pr-3">
      <h1 className="text-white font-semibold text-xl mx-4 mt-2 text-center">
        {t("leaderboard.title")}
      </h1>
      <small className="text-gray-400 flex justify-center text-center">
        {t("leaderboard.subtitle")}
      </small>
      <div className="h-full overflow-y-auto mt-3 hide-scrollbar pb-12">
        {topUsers.length === 0 ? (
          <p className="text-white text-center">{t("loading")}</p>
        ) : (
          topUsers.slice(0, visibleUsers).map(({ id, balance, firstName, lastName, userImage }, idx) => (
            <div
              key={idx}
              className={`${
                id === String(telegramId) && ""
              } flex items-center px-2 py-1 w-full`}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center rounded-full h-8 w-8">
                  <p className="text-white text-sm">{idx + 1}</p>
                </div>
              </div>
              <div className="flex-shrink-0 mr-2">
                <div className="border-yellow overflow-hidden flex items-center justify-center rounded-full bg-gray-medium h-10 w-10">
                  {userImage ? (
                    <img
                      className="w-7 h-7 object-contain"
                      src={userImage}
                      alt={firstName.charAt(0).toUpperCase()}
                    />
                  ) : (
                    <div className="text-lg text-white bg-gray-medium w-10 h-10 flex justify-center items-center">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow min-w-0 flex items-center justify-between">
                <p className="text-white font-normal truncate mr-2">
                  {firstName} {lastName}
                </p>
                <p className="text-white whitespace-nowrap flex-shrink-0">
                  {balance} PT
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {topUsers.length > visibleUsers && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreUsers}
            className="bg-blue text-white px-3 py-1  rounded-lg"
            disabled={loading}
          >
            {loading ? t("leaderboard.loadingMore") : t("leaderboard.loadMore")}
          </button>
        </div>
      )}
    </section>
  );
};

export default LeaderBoard;
