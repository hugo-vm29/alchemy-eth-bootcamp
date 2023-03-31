// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Switch {
    
    address public recipient;
    address private owner;
    uint public lastPing;

    constructor (address _recipient) payable {
        recipient = _recipient;
        owner = msg.sender;
        lastPing = block.timestamp;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function withdraw () external {

        require(block.timestamp > lastPing + 52 weeks, "Not able to withdraw");
        payable(recipient).transfer(address(this).balance);

    }

    function ping () external ownerOnly {
        lastPing = block.timestamp;
    }

    
}