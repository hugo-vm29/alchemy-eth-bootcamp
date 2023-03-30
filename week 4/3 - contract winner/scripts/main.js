const hre = require("hardhat");
const ethers = require('ethers');
require('dotenv').config();


const TARGET_CONTRACT = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";
const PROXY_CONTRACT_AD = "0x5573B5c5dB30C3dcff74188b65Fb626b0e7D271D";

async function main() {

    /*const url = process.env.GOERLI_URL;
    let provider = new ethers.providers.JsonRpcProvider(url);
    const targetContract = new ethers.Contract(TARGET_CONTRACT, contractJson.abi, provider);*/

    /*** target contract ***/
    const targetContract = await hre.ethers.getContractAt("Contract",TARGET_CONTRACT);
    const calldata = targetContract.interface.encodeFunctionData('attempt');
    console.log("Target address:", targetContract.address);


    /*** proxy contract  ***/
    const proxyContract = await hre.ethers.getContractAt("Proxy",PROXY_CONTRACT_AD);
    console.log("Proxy address:", proxyContract.address);
    await proxyContract.execute(targetContract.address, calldata);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
