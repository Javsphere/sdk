import type { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { getContractAddressesForChain } from "./addresses";
import {
  GFarmTradingStorageV5__factory,
  GNSPairInfosV6_1__factory,
  GNSPairsStorageV6__factory,
  GTokenOpenPnlFeed__factory,
  GNSNftRewardsV6__factory,
} from "./types/generated/factories";
import { Contracts } from "./types";

export const getContractsForChain = (
  chainId: number,
  signerOrProvider?: Signer | Provider
): Contracts => {
  const addresses = getContractAddressesForChain(chainId);

  return {
    gfarmTradingStorageV5: GFarmTradingStorageV5__factory.connect(
      addresses.gfarmTradingStorageV5,
      signerOrProvider as Signer | Provider
    ),
    gnsPairInfosV6_1: GNSPairInfosV6_1__factory.connect(
      addresses.gnsPairInfosV6_1,
      signerOrProvider as Signer | Provider
    ),
    gnsPairsStorageV6: GNSPairsStorageV6__factory.connect(
      addresses.gnsPairsStorageV6,
      signerOrProvider as Signer | Provider
    ),
    gTokenOpenPnlFeed: GTokenOpenPnlFeed__factory.connect(
      addresses.gTokenOpenPnlFeed,
      signerOrProvider as Signer | Provider
    ),
    gnsNftRewardsV6: GNSNftRewardsV6__factory.connect(
      addresses.gnsNftRewardsV6,
      signerOrProvider as Signer | Provider
    ),
  };
};

export * from "./utils";
export * from "./addresses";
