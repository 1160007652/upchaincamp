// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Counter {
    uint public counter;
    address public owner;

    constructor() {
        counter = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }

    function count() public onlyOwner {
        counter = counter + 1;
        console.log("solidity in console.log : ", counter);
    }
}
