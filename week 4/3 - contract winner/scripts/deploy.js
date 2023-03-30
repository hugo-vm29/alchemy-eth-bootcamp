const hre = require("hardhat");
require('dotenv').config();

async function main() {

    const contractFactory = await hre.ethers.getContractFactory("Proxy");
  
    const contactInstance = await contractFactory.deploy();
    await contactInstance.deployed();

    console.log("Contract address:", contactInstance.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
