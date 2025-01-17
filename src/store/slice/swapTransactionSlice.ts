import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { QueryIdType } from "@ston-fi/sdk"; 

export interface ITransactionDetails {
  queryId: QueryIdType;
  routerAddress: string;
  ownerAddress: string;
}

interface SwapTransactionState {
  transaction: ITransactionDetails | null;
}

const initialState: SwapTransactionState = {
  transaction: null,
};

const swapTransactionSlice = createSlice({
  name: "swapTransaction",
  initialState,
  reducers: {
    setTransaction(state, action: PayloadAction<ITransactionDetails | null>) {
      state.transaction = action.payload;
    },
    resetTransaction(state) {
      state.transaction = null;
    },
  },
});

export const { setTransaction, resetTransaction } = swapTransactionSlice.actions;
export default swapTransactionSlice.reducer;
