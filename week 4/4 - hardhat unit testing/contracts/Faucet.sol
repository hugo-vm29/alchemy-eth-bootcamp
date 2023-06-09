// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Faucet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }
  
  //receive() external payable {}
  
  function withdraw(uint _amount) payable public {
    // users can only withdraw 1 ETH at a time, feel free to change this!
    require(_amount <= 1000000000000000000, "Exceed limit");
    payable(msg.sender).transfer(_amount);
    //(bool sent, ) = payable(msg.sender).call{value: _amount}("");
    //require(sent, "Failed to send Ether");
  }

  function withdrawAll() onlyOwner public {
    (bool sent, ) = owner.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }

  function destroyFaucet() onlyOwner public {
    selfdestruct(owner);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner allowed.");
    _;
  }
}