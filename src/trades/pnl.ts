import {
  getClosingFee,
  getFundingFee,
  GetFundingFeeContext,
  getRolloverFee,
  GetRolloverFeeContext,
} from "./fees";
import { Fee, Trade, TradeInfo, TradeInitialAccFees } from "./types";

export type GetPnlContext = {
  fee: Fee | undefined;
  maxGainP: number | undefined;
} & GetRolloverFeeContext &
  GetFundingFeeContext;

export const getPnl = (
  price: number | undefined,
  trade: Trade,
  tradeInfo: TradeInfo,
  initialAccFees: TradeInitialAccFees,
  useFees: boolean,
  context: GetPnlContext
): number[] | undefined => {
  if (!price) {
    return;
  }
  const posDai = trade.initialPosToken * tradeInfo.tokenPriceDai;
  const { openPrice, leverage } = trade;
  const {
    maxGainP,
    currentBlock,
    pairParams,
    pairRolloverFees,
    pairFundingFees,
    openInterest,
    fee,
  } = context;
  const maxGain = maxGainP === undefined ? Infinity : (maxGainP / 100) * posDai;

  let pnlDai = trade.buy
    ? ((price - openPrice) / openPrice) * leverage * posDai
    : ((openPrice - price) / openPrice) * leverage * posDai;

  pnlDai = pnlDai > maxGain ? maxGain : pnlDai;

  if (useFees) {
    pnlDai -= getRolloverFee(
      posDai,
      initialAccFees.rollover,
      initialAccFees.openedAfterUpdate,
      {
        currentBlock,
        pairParams,
        pairRolloverFees,
      }
    );
    pnlDai -= getFundingFee(
      posDai * trade.leverage,
      initialAccFees.funding,
      trade.buy,
      initialAccFees.openedAfterUpdate,
      {
        currentBlock,
        pairParams,
        pairFundingFees,
        openInterest,
      }
    );
  }

  let pnlPercentage = (pnlDai / posDai) * 100;

  // Can be liquidated
  if (pnlPercentage <= -90) {
    pnlPercentage = -100;
  } else {
    pnlDai -= getClosingFee(posDai, trade.leverage, trade.pairIndex, fee);
    pnlPercentage = (pnlDai / posDai) * 100;
  }

  pnlPercentage = pnlPercentage < -100 ? -100 : pnlPercentage;

  pnlDai = (posDai * pnlPercentage) / 100;

  return [pnlDai, pnlPercentage];
};
