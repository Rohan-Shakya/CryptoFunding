import React from "react";

import { loader } from "../assets";
import Image from "next/image";
import { CampaignType } from "@/@types/CampaignType";
import FundCard from "./FundCard";
import Link from "next/link";

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: CampaignType[];
}

const DisplayCampaigns: React.FC<DisplayCampaignsProps> = ({
  title,
  isLoading,
  campaigns,
}: DisplayCampaignsProps): JSX.Element => {
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Image
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign, index) => {
            console.log(campaign);
            return (
              <Link
                href={{
                  pathname: `/campaigns/${campaign.id}`,
                }}
                key={index}
              >
                <FundCard {...campaign} />
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
