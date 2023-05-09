// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CryptoFunding {
    struct Campaign {
        bytes32 id;
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        string slug;
        address[] donators;
        uint256[] donations;
    }

    Campaign[] public campaigns;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image, string memory _slug) public returns (bytes32) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        bytes32 id = keccak256(abi.encodePacked(block.timestamp, msg.sender, campaigns.length));

        Campaign memory newCampaign = Campaign({
            id: id,
            owner: _owner,
            title: _title,
            description: _description,
            target: _target,
            deadline: _deadline,
            amountCollected: 0,
            image: _image,
            slug: _slug,
            donators: new address[](0),
            donations: new uint256[](0)
        });

        campaigns.push(newCampaign);

        return id;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < campaigns.length, "The specified campaign ID does not exist.");

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        (bool sent,) = payable(campaign.owner).call{value: msg.value}("");

        require(sent, "Failed to send Ether");

        campaign.amountCollected += msg.value;
    }

    function getCampaignDonators(bytes32 _id) public view returns (address[] memory, uint256[] memory) {
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].id == _id) {
                return (campaigns[i].donators, campaigns[i].donations);
            }
        }

        revert("The specified campaign ID does not exist.");
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    function getCampaign(bytes32 _id) public view returns (Campaign memory) {
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].id == _id) {
                return campaigns[i];
            }
        }

        revert("The specified campaign ID does not exist.");
    }
}