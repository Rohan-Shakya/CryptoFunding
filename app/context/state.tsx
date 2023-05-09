import { createContext, useContext, useState } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { CampaignType } from "@/@types/CampaignType";

type ContextProps = {
  children: React.ReactNode;
};

type DefaultValue = {
  address: string | undefined;
  contract: any;
  connect: () => void;
  createCampaign: (form: CampaignType) => Promise<void>;
  getCampaigns: () => Promise<any>;
  getUserCampaigns: () => Promise<any>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (
    pId: string
  ) => Promise<{ donator: string; donation: string }[]>;
};

const contextDefaultValue: DefaultValue = {
  address: "",
  contract: "",
  connect: () => {},
  createCampaign: (form) => Promise.resolve(),
  getCampaigns: () => Promise.resolve(),
  getUserCampaigns: () => Promise.resolve(),
  donate: () => Promise.resolve(),
  getDonations: () => Promise.resolve([{ donator: "", donation: "" }]),
};

const StateContext = createContext(contextDefaultValue);

export const StateContextProvider = ({
  children,
}: ContextProps): JSX.Element => {
  const { contract }: any = useContract(
    "0x962B0D2eB5964E350e0FD985b5408C38C400bBA8"
  );
  const { mutateAsync, isLoading } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: CampaignType) => {
    try {
      const data = await mutateAsync({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target, // target
          new Date(form.deadline).getTime(), // deadline,
          form.image, // image
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      alert(JSON.stringify(error));
      console.error("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaigns = campaigns.map(
      (campaign: CampaignType, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      })
    );

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign: CampaignType) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: string): Promise<any> => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (
    pId: string
  ): Promise<{ donator: string; donation: string }[]> => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations: { donator: string; donation: string }[] = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
