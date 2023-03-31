// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {

	address public depositor;
    address public beneficiary;
    address public arbiter;
    bool public isApproved;
    
	event Approved(uint amount);
    
    constructor (address payable _arbiter, address payable _beneficiary) payable{
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    }

    function approve() external {
        
		require(msg.sender == arbiter, "Not authorized");
		payable(beneficiary).transfer(address(this).balance);
		
		/* (bool sent, ) = payable(beneficiary).call{value: balance}("");
 		   require(sent, "Failed to send Ether");*/

        isApproved = true;
        emit Approved(address(this).balance);
    }
}
