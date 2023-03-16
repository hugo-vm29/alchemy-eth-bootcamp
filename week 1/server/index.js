const express = require("express");
const app = express();
const cors = require("cors");
const walletHelper = require("./wallets");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = walletHelper.getWalletBalance(address);
  // const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount } = req.body;

  const transactionToSign = {
    to: recipient,
    value: amount
  };

  const fromBalance = walletHelper.getWalletBalance(sender);

  if(fromBalance < amount){
    res.status(400).send({ message: "Not enough funds!" });
  }

  try{

    walletHelper.setInitialBalance(sender);
    walletHelper.setInitialBalance(recipient);

    const signedTransaction = await walletHelper.signTransaction(transactionToSign,sender);
    const [tnxHash, balance] = walletHelper.sendSignedTransaction(signedTransaction,transactionToSign);
    res.send({hash: tnxHash, balance : balance});

  }catch(err){
    console.log("An error have ocurred", err);
    return res.status(500).send({ message: err?.message || ""});
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
