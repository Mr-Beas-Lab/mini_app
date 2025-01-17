import BigNumber from 'bignumber.js';

// Configure BigNumber to include commas for thousands and dots for decimals
BigNumber.config({ FORMAT: { decimalSeparator: '.', groupSeparator: ',', groupSize: 3 } });

export function formatBalance(balance) {
  // Create a BigNumber instance
  const balanceBN = new BigNumber(balance);
  // Divide by 1e9 to convert from nanotons to tons
  const formattedBalance = balanceBN.dividedBy(1e9);
  // Format with 2 decimal places
  return formattedBalance.toFormat(2);
}