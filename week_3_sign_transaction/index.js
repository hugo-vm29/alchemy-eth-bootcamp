const { Alchemy, Network, Wallet, Utils } = require('alchemy-sdk');
require('dotenv').config();

const { TEST_API_KEY, TEST_PRIVATE_KEY } = process.env;

const settings = {
  apiKey: TEST_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

let wallet = new Wallet(TEST_PRIVATE_KEY);

async function main() {

  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    'latest'
  );

  let transaction = {
    to: "0x25DD09A8d51460730a896e7CD58D87daD624c063",
    value: Utils.parseEther('1'), 
    gasLimit: '21000',
    maxPriorityFeePerGas: Utils.parseUnits('5', 'gwei'),
    maxFeePerGas: Utils.parseUnits('20', 'gwei'),
    nonce: nonce,
    type: 2,
    chainId: 5, // göerli transaction
  };

  let rawTransaction = await wallet.signTransaction(transaction);
  console.log('Raw tx: ', rawTransaction);
  
  let tx = await alchemy.core.sendTransaction(rawTransaction);
  
  console.log("response -> ", tx);

  console.log(`https://goerli.etherscan.io/tx/${tx.hash}`);

}

main();