import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LiquidityFormState {
  userWalletAddress: string;
  jetton0Address: string;
  jetton1Address: string;
  tonAmount: string;
  jettonAmount: string;
  minLpOut: string;
  queryId: number;
}

const initialState: LiquidityFormState = {
  userWalletAddress: "",
  jetton0Address: "EQC18yLE5Ad71VntcIwaMq_PwAW1o2-0CCoH_sTfcdRc7rWZ", // MRB
  jetton1Address: "", 
  tonAmount: "",
  jettonAmount: "",
  minLpOut: "1",
  queryId: Date.now(), // Unique query ID for transactions
};

const liquidityFormSlice = createSlice({
  name: "liquidityForm",
  initialState,
  reducers: {
    setUserWalletAddress: (state, action: PayloadAction<string>) => {
      state.userWalletAddress = action.payload;
    },
    setJetton0Address: (state, action: PayloadAction<string>) => {
      state.jetton0Address = action.payload;
    },
    setJetton1Address: (state, action: PayloadAction<string>) => {
      state.jetton1Address = action.payload;
    },
    setTonAmount: (state, action: PayloadAction<string>) => {
      state.tonAmount = action.payload;
    },
    setJettonAmount: (state, action: PayloadAction<string>) => {
      state.jettonAmount = action.payload;
    },
    setMinLpOut: (state, action: PayloadAction<string>) => {
      state.minLpOut = action.payload;
    },
    setQueryId: (state) => {
      state.queryId = Date.now();
    },
    resetForm: () => initialState, // Resets form to default values
  },
});

export const {
  setUserWalletAddress,
  setJetton0Address,
  setJetton1Address,
  setTonAmount,
  setJettonAmount,
  setMinLpOut,
  setQueryId,
  resetForm,
} = liquidityFormSlice.actions;

export default liquidityFormSlice.reducer;
