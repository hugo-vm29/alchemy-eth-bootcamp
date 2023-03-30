const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../utils/MerkleTree');
const niceList = require('../utils/niceList.json');

const port = 1225;

const app = express();
app.use(express.json());

const tree =  new MerkleTree(niceList);
const MERKLE_ROOT = tree.getRoot();

app.post('/gift', (req, res) => {

  const { proof, name } = req.body;


  // TODO: prove that a name is in the list 
  const isInTheList = verifyProof(proof,name,MERKLE_ROOT);

  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
