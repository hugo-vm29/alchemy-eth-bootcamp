const ethers = require('ethers');
const hre = require("hardhat");
require('dotenv').config();

async function main() {
  
  const url = process.env.GOERLI_URL;

  //console.log("url", url);

  const provider = new ethers.providers.JsonRpcProvider(url);
  
  let artifacts = await hre.artifacts.readArtifact("Faucet");
  let privateKey = process.env.TEST_PRIVATE_KEY;
  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);
  let faucet = await factory.deploy();

  console.log("Faucet address:", faucet.address);

  await faucet.deployed();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
