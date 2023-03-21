const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {


  const nameToProof = "Norman Block";
  const index = niceList.findIndex(n => n === nameToProof);

  const merkleTree = new MerkleTree(niceList);
  const clientProof = merkleTree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof: clientProof,
    name: nameToProof
  });

  console.log({ gift });
}

main();