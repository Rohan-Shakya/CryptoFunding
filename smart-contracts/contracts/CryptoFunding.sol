// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CryptoFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    Campaign[] public campaigns;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        Campaign memory newCampaign = Campaign({
            owner: _owner,
            title: _title,
            description: _description,
            target: _target,
            deadline: _deadline,
            amountCollected: 0,
            image: _image,
            donators: new address[](0),
            donations: new uint256[](0)
        });

        campaigns.push(newCampaign);

        return campaigns.length - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        (bool sent,) = payable(campaign.owner).call{value: msg.value}("");

        require(sent, "Failed to send Ether");

        campaign.amountCollected += msg.value;
    }

    function getCampaignDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];

        return (campaign.donators, campaign.donations);
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}