import { ethers } from "ethers";

type CampaignType = {
  owner?: string;
  address: string;
  title: string;
  description: string;
  target: ethers.BigNumberType;
  deadline: ethers.BigNumberType;
  amountCollected: ethers.BigNumberType;
  image: string;
  donators: string[];
  donations: number[];
};
