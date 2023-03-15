// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Bank {
    // 合约拥有者
    address public owner;
    // 映射表，表示 { 存储用户地址: 余额 }
    mapping(address => uint) public balances;

    // 部署合约时，可以接受存款，
    constructor() payable {
        owner = msg.sender;
        balances[msg.sender] += msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }

    // 接收存款 - 方法1：直接使用 metamask 等钱包APP向合约转账
    // external 只允许合约外部调用
    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    // 接收存款 - 方法2：通过调用合约的 deposit 方法向合约转账
    // 可以让其他合约调用
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // 查询余额函数，允许用户查询其余额
    function balance() public view returns (uint) {
        return balances[msg.sender]; // 返回用户余额
    }

    // 提取金额到自己的地址
    function withdraw(uint amount) public {
        // 检查用户余额是否足够
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // 需要在转账之前先扣除转账的金额，来防止重入攻击，如果转账失败，交易会被 revert
        balances[msg.sender] -= amount;

        // 向用户地址转账, 谁调用 withdraw , msg.sender 就是谁 ， 表示给 msg.sender 转入金钱
        payable(msg.sender).transfer(amount);
        // 转账成功后, 更新用户的存款信息
    }

    // 提取账户下的所有金额到指定地址
    function withdrawByOuther(address to) public {
        // 检查用户余额是否足够
        require(balances[msg.sender] > 0, "Insufficient balance");

        // 需要在转账之前先扣除转账的金额，来防止重入攻击，如果转账失败，交易会被 revert
        uint amount = balances[msg.sender];
        delete balances[msg.sender];

        // 直接将金额提取到，指定的地址中
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to extract eth to the specified address!");
    }
}
