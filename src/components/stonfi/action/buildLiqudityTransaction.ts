import { TonClient, toNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

export const useProvideLiquidityTxParams = () => {
  return async ({
    userWalletAddress,
    jetton0Address,
    jetton1Address,
    tonAmount,
    jettonAmount,
    minLpOut,
    queryId,
  }) => {
    if (!userWalletAddress || !jetton0Address || (!tonAmount && !jettonAmount)) {
      throw new Error("Missing required liquidity parameters.");
    }

    const router = client.open(new DEX.v1.Router());

    const isTonJetton0 = jetton0Address === "TON";
    const isTonJetton1 = jetton1Address === "TON";

    const txsParams = await Promise.all([
      isTonJetton0
        ? router.getProvideLiquidityTonTxParams({
            userWalletAddress,
            proxyTon: new pTON.v1(),
            sendAmount: toNano(tonAmount),
            otherTokenAddress: jetton1Address,
            minLpOut,
            queryId,
          })
        : router.getProvideLiquidityJettonTxParams({
            userWalletAddress,
            sendTokenAddress: jetton0Address,
            sendAmount: toNano(jettonAmount),
            otherTokenAddress: isTonJetton1 ? new pTON.v1().address : jetton1Address,
            minLpOut,
            queryId,
          }),
      isTonJetton1
        ? router.getProvideLiquidityTonTxParams({
            userWalletAddress,
            proxyTon: new pTON.v1(),
            sendAmount: toNano(tonAmount),
            otherTokenAddress: jetton0Address,
            minLpOut,
            queryId,
          })
        : router.getProvideLiquidityJettonTxParams({
            userWalletAddress,
            sendTokenAddress: jetton1Address,
            sendAmount: toNano(jettonAmount),
            otherTokenAddress: isTonJetton0 ? new pTON.v1().address : jetton0Address,
            minLpOut,
            queryId,
          }),
    ]);

    return txsParams;
  };
};
