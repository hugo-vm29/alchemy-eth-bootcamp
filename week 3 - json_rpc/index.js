const axios = require('axios');


async function main() {

  const ALCHEMY_URL = "https://eth-mainnet.g.alchemy.com/v2/ExPC95qHvt0IjT-sEVpgWs_9s9JMTvvU";

  axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getBlockByNumber",
    params: [
      "0xb443", // block 46147
      true  // retrieve the full transaction object in transactions array
    ]
  }).then((response) => {
    console.log(response.data.result);
  });

}

main();