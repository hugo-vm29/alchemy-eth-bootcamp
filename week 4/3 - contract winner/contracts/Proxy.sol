//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Proxy {

  function execute(address targetContract,  bytes calldata data ) external {
    (bool success, ) = targetContract.call(abi.encodePacked(data));
    require(success);
  }

}