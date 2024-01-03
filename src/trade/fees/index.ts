import { Fee } from "../types";

export const getClosingFee = (
  posDai: number,
  leverage: number,
  pairIndex: number,
  pairFee: Fee | undefined
): number => {
  if (
    posDai === undefined ||
    leverage === undefined ||
    pairIndex === undefined ||
    pairFee === undefined
  ) {
    return 0;
  }

  const { closeFeeP, nftLimitOrderFeeP } = pairFee;

  return (closeFeeP + nftLimitOrderFeeP) * posDai * leverage;
};

export * from "./borrowing";
