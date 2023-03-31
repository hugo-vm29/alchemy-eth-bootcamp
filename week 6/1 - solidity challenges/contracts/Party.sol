// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Party {

    uint256 public rsvpFee;
    //mapping(address => bool) private rsvpList;
    address[] private rsvpList;

    constructor(uint256 _fee){
        rsvpFee = _fee;
    }

    function findRSVP(address _address) internal view returns (bool) {
        
        for(uint i = 0; i < rsvpList.length; i++){
            if( rsvpList[i] == _address) return true;
        }

        return false;
    }

    function rsvp() external payable {
        require(msg.value == rsvpFee, "Incorrect payment");
        require( findRSVP(msg.sender) == false, "Already have a reservation");
        rsvpList.push(msg.sender);
    }

    function payBill(address venue, uint total) external payable {
       
        payable(venue).transfer(total);

        if(address(this).balance > 0){
            uint amount = address(this).balance/rsvpList.length;
            
            for(uint i = 0; i < rsvpList.length; i++){
                payable(rsvpList[i]).transfer(amount);
            }  
        }

    }


	
}