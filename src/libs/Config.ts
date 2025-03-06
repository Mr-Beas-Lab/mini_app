// Configuration constants
export const CONFIG = {
  TOP_USERS_LIMIT: 10,
  USER_CACHE_TTL: 60 * 60 * 1000, // 1 hour
  TOP_USERS_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  TOAST: {
    AUTO_CLOSE: 2500,
    STYLE: {
      container: {
        width: "calc(100% - 40px)",
        maxWidth: "none",
        left: "20px",
        right: "20px",
        top: "30px",
        height: "80px",
      },
      toast: {
        minHeight: "20px",
        padding: "0px 10px",
        paddingBottom: "4px",
        borderRadius: "6px",
        marginBottom: "4px",
      }
    }
  }
};