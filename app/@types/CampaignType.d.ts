import { ethers } from "ethers";

type CampaignType = {
  id: string;
  owner: string;
  address: string;
  title: string;
  slug: string;
  description: string;
  target: ethers.BigNumberType;
  deadline: ethers.BigNumberType;
  amountCollected: ethers.BigNumberType;
  image: string;
  donators: string[];
  donations: number[];
};
