import DisplayCampaigns from "@/components/DisplayCampaigns";
import { useStateContext } from "@/context/state";
import React, { useState, useEffect, useCallback } from "react";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }, [getUserCampaigns]);

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }
  }, [address, contract, fetchCampaigns]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Profile;
