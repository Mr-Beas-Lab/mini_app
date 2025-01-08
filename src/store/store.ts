import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice'
import calculateSlice from './slice/calculateSlice'
import coinShowSlice from './slice/coinShowSlice'
import messageSlice from './slice/messageSlice'
import topUsersSlice from './slice/topUsersSlice'
import premiumSlice from './slice/PremiumSlice'
import walletSlice from './slice/walletSlice'
import swapSlippageReducer from './slice/swapSlippageSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        calculate: calculateSlice,
        coinShow: coinShowSlice,
        message:messageSlice,
        topUsers:topUsersSlice,
        premium: premiumSlice,
        wallet: walletSlice,
        swapSlippage: swapSlippageReducer,

    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
