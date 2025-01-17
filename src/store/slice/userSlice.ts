import { RootState } from '@/store/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
 
// Define user type
export type TUser = {
  uid: string;
  balance: number;
  daily?: {
    claimedTime: Date | null;
    claimedDay: number; // The current claim day
  };
  firstName: string;
  lastName: string;
  userImage: string | null;
  username?: string
  languageCode?:string,
  referrals?: string[],
  referredBy?: string | null,
  isPremium?: boolean
  walletAddress?: string | null
  rank?: number;  
};

export type TUserSlice = {
  value: TUser | null; // User object or null if no user is logged in
};

// Initial state
const initialState: TUserSlice = {
  value: null,
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user data
    setUser: (state, action: PayloadAction<TUser>) => {
      state.value = action.payload;
    },
    // Action to clear user data
    clearUser: (state) => {
      state.value = null;
    },
    // Action to update user balance
    updateUserBalance: (state, action: PayloadAction<number>) => {
      if (state.value) {
        state.value.balance = action.payload; // Update the balance
      }
    },
  },
});

// Selector to get the user from the Redux state
export const selectUser = (state: RootState): TUser | null => state.user.value;

// Export actions and reducer
export const { setUser, clearUser, updateUserBalance } = userSlice.actions;
export default userSlice.reducer;
