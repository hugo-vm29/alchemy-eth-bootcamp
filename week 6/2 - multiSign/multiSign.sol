// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {

    struct Transaction{
        address to;
        uint256 value;
        bytes data;
        bool executed;
    }

    address [] public owners;
    uint256 public required;
    
    Transaction [] public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor( address[] memory _owners, uint256 _required){
        
        require( _owners.length > 0, "No owners");
        require( _required > 0, "Required confirmations must be above 0");
        require( _required < _owners.length, "Required confirmations must be less than total owners");

        owners = _owners;
        required = _required;
    }

    receive() external payable {}

    modifier ownersOnly() {
        
        bool exist;
        for (uint i = 0; i < owners.length; i++) {
            if(!exist && owners[i] == msg.sender){
                exist = true;
            }
        }
        
        require(exist, "Caller is not owner");
        _;
    }

    function transactionCount() public view returns (uint) {
        return transactions.length;
    }

    function submitTransaction(address _to, uint256 _value, bytes calldata _data) external {
        uint id = addTransaction(_to,_value, _data);
        confirmTransaction(id);
    }

    function addTransaction(address _to, uint256 _value, bytes calldata _data) internal returns(uint) {
        Transaction memory newTxn = Transaction(_to,_value, _data, false);
        uint idx = transactionCount();
        transactions.push(newTxn);
        return idx;
    }

    function confirmTransaction(uint transactionId) public ownersOnly {
        confirmations[transactionId][msg.sender] = true;
        bool confirmedTx = isConfirmed(transactionId);
        if(confirmedTx){
            executeTransaction(transactionId);
        }
    }

    function executeTransaction(uint transactionId) internal {
        //bool confirmedTx = isConfirmed(transactionId);
        //require(confirmedTx, "Transaction not confirmed");
        Transaction storage txItem = transactions[transactionId];
        (bool success, )  = txItem.to.call{value : txItem.value}(txItem.data);
        require(success, "Transaction error");
        txItem.executed = true;
    }


    function isConfirmed(uint transactionId) public view returns(bool){
        uint totalConfirmations = getConfirmationsCount(transactionId);
        return (totalConfirmations >= required);
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint)  {
        
        mapping(address => bool) storage confirmationsForId = confirmations[transactionId];

        uint total = 0;
        for (uint i = 0; i < owners.length; i++) {
           if(confirmationsForId[ owners[i] ]){
               total++;
           }
        }
        return total;
    }
}
