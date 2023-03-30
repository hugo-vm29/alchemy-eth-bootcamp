# Local Hardhat Games

Week 5

Activity: hardhat challenges

## Run the Hardhat Node

Review your `hardhat.config.js` file:

```javascript
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: 'localhost' // <-- this one!
};
```

The `defaultNetwork` is going to set our scripts to run, by default, against our local node. 

To start the node use `npx hardhat node`. This will spin up a local, persistent hardhat blockchain on your port 8545. 

## Deploy a contract

Change the contract name in `scripts/deploy.js`. In a new terminal tab use `npx hardhat run scripts/deploy.js`. 


## Play the games

Try each game! See if you can emit the Winner event on each one. Remember to:

1. Change the `contractName` in `scripts/deploy.js`
2. Deploy each new game to your local hardhat environment 
3. Copy the address into the `scripts/win.js`
4. Change the `contractName` in `scripts/win.js`
5. Modify the win script to succesfully complete the challenge. You may need to run multiple transactions in order to win each game!

# Troubleshooting

## Use Hardhat Console Log

Are you stuck on a particular challenge? You can use `console.log` from Hardhat! To do so, simply import it into your contract (before you deploy it):

```solidity
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Game1 {
  event Winner(address winner);

  function win() public {
    console.log(22);
    emit Winner(msg.sender);
  }
}
```