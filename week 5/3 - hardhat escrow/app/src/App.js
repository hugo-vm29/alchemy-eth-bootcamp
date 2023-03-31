import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import ContractJson from './artifacts/contracts/Escrow.sol/Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  
  try{
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
  }catch(err){
    console.log("Unable to approve", err?.message || "");
  }

}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
  
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
 
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;

    const inputValue = document.getElementById('amount').value;
    const etherAmount = ethers.utils.parseEther(inputValue);
    //console.log("etherAmount",etherAmount);
    const escrowContract = await deploy(signer, arbiter, beneficiary, etherAmount);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: etherAmount.toString(),
      isApproved: false,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  async function importContract() {

    const contractAddress = document.getElementById('contract_address').value;

    if(contractAddress){
      
      const importedContract = new ethers.Contract(contractAddress, ContractJson.abi, provider);
      
      try{
        
        await importedContract.deployed();
        //console.log("importedContract", importedContract);
        const arbiter =  await importedContract.arbiter();
        const beneficiary = await importedContract.beneficiary();
        const isApproved = await importedContract.isApproved();

        const contractBalance = await provider.getBalance(contractAddress);
        const balanceInEther = ethers.utils.formatEther( contractBalance );

        const escrow = {
          address: contractAddress,
          arbiter,
          beneficiary,
          value: balanceInEther,
          isApproved: isApproved,
          handleApprove: async () => {
            importedContract.on('Approved', () => {
              document.getElementById(contractAddress).className =
                'complete';
              document.getElementById(contractAddress).innerText =
                "✓ It's been approved!";
            });

            await approve(importedContract, signer);
          },
        };

        setEscrows([...escrows, escrow]);
        document.getElementById('contract_address').value = "";

      }catch(err){
        console.log("contract address not valid");
      }
    }
  }


  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ether)
          <input type="text" id="amount" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="contract">
        <h1> Import Contract </h1>
        <label>
          Contract Address
          <input type="text" id="contract_address" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            importContract();
          }}
        >
          Import
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>

    </>
  );
}

export default App;
