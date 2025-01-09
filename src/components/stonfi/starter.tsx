import { DEX, pTON } from "@ston-fi/sdk";
import { beginCell, Address } from "@ton/core";
import { TonClient, toNano } from "@ton/ton";

// Initialize client for mainnet
const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
  });

const TON_ADDRESS = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';

export const buildSwapTransaction = async ({ userWalletAddress, inTokenAddress, outTokenAddress, amount }) => {
    // Format wallet address
    const formattedAddress = userWalletAddress.startsWith('0:')
        ? Address.parse(userWalletAddress).toString()
        : userWalletAddress;

    // Initialize router with v2.1
    const router = client.open(
        DEX.v2_1.Router.create(
            "kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v" // CPI Router v2.1.0
        )
    );

    // Initialize pTON v2.1
    const proxyTon = pTON.v2_1.create(
        "kQACS30DNoUQ7NfApPvzh7eBmSZ9L4ygJ-lkNWtba8TQT-Px" // pTON v2.1.0
    );

    console.log('Swap Parameters:', {
        userWalletAddress: formattedAddress,
        inTokenAddress,
        outTokenAddress,
        amount
    });

    let txParams;
    if (inTokenAddress === TON_ADDRESS) {
        // TON -> Jetton
        console.log('Swap Type: TON -> Jetton');
        txParams = await router.getSwapTonToJettonTxParams({
            userWalletAddress: formattedAddress,
            proxyTon,
            offerAmount: toNano(amount.toString()),
            askJettonAddress: outTokenAddress,
            minAskAmount: "1",
            queryId: Date.now(),
        });
    } else if (outTokenAddress === TON_ADDRESS) {
        // Jetton -> TON
        console.log('Swap Type: Jetton -> TON');
        txParams = await router.getSwapJettonToTonTxParams({
            userWalletAddress: formattedAddress,
            offerJettonAddress: inTokenAddress,
            offerAmount: toNano(amount.toString()),
            minAskAmount: "1",
            proxyTon,
            queryId: Date.now(),
        });
    } else {
        // Jetton -> Jetton
        console.log('Swap Type: Jetton -> Jetton');
        txParams = await router.getSwapJettonToJettonTxParams({
            userWalletAddress: formattedAddress,
            offerJettonAddress: inTokenAddress,
            offerAmount: toNano(amount.toString()),
            askJettonAddress: outTokenAddress,
            minAskAmount: "1",
            queryId: Date.now(),
        });
    }

    // Create fee instruction
    const feeInst = {
        address: process.env.ADMIN_WALLET_ADDRESS,
        amount: toNano("0.1").toString(),
        payload: beginCell()
            .storeUint(0, 32)
            .storeStringTail("Swap Fee")
            .endCell()
            .toBoc()
            .toString("base64"),
    };

    // Create swap instruction
    const swapInst = {
        address: txParams.to.toString(),
        amount: txParams.value.toString(),
        payload: txParams.body?.toBoc().toString("base64"),
    };

    return [feeInst, swapInst];
};

