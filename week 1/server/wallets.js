const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes , hexToBytes, toHex} = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
//import { hexToBytes, toHex } from "ethereum-cryptography/utils";

const wallets = [
  {
    name: "wallet A",
    publicKey: "0x761FA1653fc7FddCAa7aeAB09b830C06e0C2919a",
    privateKey: "91477da3abd7c56f0f95d061a01515874ed2c3d1408140a6369d8faf90d40e2d",
    balance: 100
  },
  {
    name: "wallet B",
    publicKey: "0xcea95759B4bE7EE93914906A9AE6C9db6322b481",
    privateKey: "9e05055c6baf9b4c362462575ac69f08f5b9288ae3db277441ad4f0ae9006573",
    balance: 30
  },
  {
    name: "wallet C",
    publicKey: "0x3Ce27Eb0E35f77Ff40757789B889Bda82cEa7b38",
    privateKey: "cd25540a3947d320db284ccd9498a3ac71478c40faea144e1461ead35e702293",
    balance: 15
  }
]

const getWalletBalance = (address) => {
  let balance = 0;
  try {
    const walletItem = wallets.find( item => item.publicKey == address);
    if(walletItem) balance =  walletItem.balance;
  } catch (err) {
    console.log('Error getting ethereum balance');
  }
  return balance;
};

const hashMessage = (message) => {
  const bytes = Uint8Array.from(message);
  const hash = keccak256(bytes); 
  return hash;
}

const signTransaction = async (message, from) => {
  const userWallet = wallets.find( item => item.publicKey == from);
  const pvyKey = userWallet?.privateKey || "";

  const hashedMessage = hashMessage(message);
  const [signature, recoveryBit] = await secp.sign(hashedMessage, pvyKey, {
    recovered: true,
  });

  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
}

const signatureToPubKey = (signature, hashedMessage) => {
  const fullSignatureBytes = hexToBytes(signature);
  const recoveryBit = fullSignatureBytes[0];
  const signatureBytes = fullSignatureBytes.slice(1);
  return secp.recoverPublicKey(hashedMessage, signatureBytes, recoveryBit);
};

const pubKeyToAddress = (pubKey) => {
  const hash = keccak256(pubKey.slice(1));
  return toHex(hash.slice(-20)).toUpperCase();
};


const sendSignedTransaction = ( signedTransaction,transactionToSign ) => {

  let tnxHash = "00111";

  //reduce balance from sender
  const hashedMessage = hashMessage(transactionToSign);
  const pubKey = signatureToPubKey(signedTransaction, hashedMessage);
  
  const sender = `0x${pubKeyToAddress(pubKey)}`;
  const walletFrom = wallets.find( item => item.publicKey.toUpperCase() == sender.toUpperCase());
  walletFrom.balance -= transactionToSign.value;

  //reduce balance from recipient
  const recipient = transactionToSign.to;
  const walletTo = wallets.find( item => item.publicKey.toUpperCase() == recipient.toUpperCase());
  walletTo.balance += transactionToSign.value;

  return [tnxHash, walletFrom.balance];
}

const setInitialBalance = (address) => {
  const walletItem = wallets.find( item => item.publicKey == address);
  if(!walletItem){
    wallets.push(
        {
            name: "new wallet",
            publicKey: address,
            privateKey: "",
            balance: 0
        }
    );
  }
}

module.exports = {
  getWalletBalance,
  signTransaction,
  setInitialBalance,
  sendSignedTransaction
};
