import { useEffect } from "react";
import { useSwapStatusQuery } from "./swapStatusQuery";
import { setShowMessage } from "@/store/slice/messageSlice";
import { useDispatch } from "react-redux";

export const useSwapStatusNotifications = () => {
  const { data, isError } = useSwapStatusQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isError) return;

     dispatch(
            setShowMessage({
              message: 'Transaction status refetch has been failed!',
              color: 'red',
            })
          );
  }, [isError, setShowMessage]);

  useEffect(() => {
    if (!data?.exitCode) return;
  
    const msg =
      data.exitCode === "failed"
        ? "Transaction failed"
        : data.exitCode === "swap_ok"
        ? "Transaction has successfully finished"
        : "Transaction has finished with unknown status";
  
    dispatch(
      setShowMessage({
        message: msg,
        color: "green",
      })
    );
  }, [data?.exitCode,setShowMessage]);
  
};