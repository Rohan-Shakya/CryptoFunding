/** @type import('hardhat/config').HardhatUserConfig */
const dotenv = require("dotenv");

dotenv.config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.9",
    defaultNetwork: "sepolia",
    networks: {
      sepolia: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
