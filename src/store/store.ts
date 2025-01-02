import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice'
import calculateSlice from './slice/calculateSlice'
import coinShowSlice from './slice/coinShowSlice'
import messageSlice from './slice/messageSlice'
import topUsersSlice from './slice/topUsersSlice'
import premiumSlice from './slice/PremiumSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        calculate: calculateSlice,
        coinShow: coinShowSlice,
        message:messageSlice,
        topUsers:topUsersSlice,
        premium: premiumSlice,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
