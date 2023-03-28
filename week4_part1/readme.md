# Week 4 - Smart Contract Winner

Alchemy University Ethereum Dev Bootcamp - Week 4 Assigments

Goal: 

Emit the winner event on this smart contract on the Goerli testnet: https://goerli.etherscan.io/address/0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502#code

Solution:

A proxy contract is used to call the target contract making msg.sender and tx.origin different.
