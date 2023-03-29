require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: "0.8.4",
  networks:{
    goerli:{
      url: process.env.GOERLI_URL,
      accounts: [ process.env.TEST_PRIVATE_KEY]
    }
  }
};
