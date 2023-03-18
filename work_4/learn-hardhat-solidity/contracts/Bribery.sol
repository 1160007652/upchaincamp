// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Bribery {
    // 教师专项用款地址
    address public owner;

    // 映射表，表示 { 存储用户地址: 余额 }
    mapping(address => uint) public balances;

    // 部署合约时，可以接受存款，
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }

    // 存款
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // 查询余额
    function balance() public view returns (uint) {
        return balances[msg.sender];
    }

    // 行贿扣款金额，1分 = 1 wei
    function withdraw(address to, uint amount) internal onlyOwner {
        require(balances[to] > 0, "Insufficient balance");
        balances[to] -= amount;
        payable(owner).transfer(amount);
    }
}
