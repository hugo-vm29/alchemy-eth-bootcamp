const hre = require("hardhat");

async function main() {


  const contractFactory = await hre.ethers.getContractFactory("Faucet");
  const faucetContract = await contractFactory.deploy();

  await faucetContract.deployed();

  console.log(
    `Contract deployed to ${faucetContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
