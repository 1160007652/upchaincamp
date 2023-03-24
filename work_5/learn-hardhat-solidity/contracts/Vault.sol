// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    // { msg.sender : { tokenAddress: amount } }
    mapping(address => mapping(address => uint256)) private deposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function deposite(address token, uint256 amount) public {
        require(amount > 0, "Vault: amount must be greater than zero");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        deposits[msg.sender][token] += amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(address token, uint256 amount) public {
        require(amount > 0, "Vault: amount must be greater than zero");
        require(
            deposits[msg.sender][token] >= amount,
            "Vault: insufficient balance"
        );
        deposits[msg.sender][token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function balanceOf(
        address user,
        address token
    ) external view returns (uint256) {
        return deposits[user][token];
    }
}
