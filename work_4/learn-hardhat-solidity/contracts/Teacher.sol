// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./ScoreSheet.sol";
import "./Bribery.sol";

contract Teacher is Bribery {
    // 合约拥有者
    address public scoreSheet;
    uint public buySocreAmount = 1;

    // 部署合约时，可以接受存款，
    constructor() payable {
        owner = msg.sender;

        // 部署成绩表合约，用于存储分数
        ScoreSheet _scoreSheet = new ScoreSheet();
        scoreSheet = address(_scoreSheet);
    }

    // 定义错误抛出
    error BuyScoreByNotAmount();

    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    // 设置学生成绩
    function setScore(
        address student,
        uint8 score,
        string memory course
    ) external onlyOwner {
        IScoreSheet(scoreSheet).setScore(student, score, course);
    }

    function setScoreByBuy(
        address student,
        uint8 score,
        string memory course
    ) external payable onlyOwner {
        uint _amount = buySocreAmount * score;
        if (_amount > balances[student]) revert BuyScoreByNotAmount();

        uint8 _score = IScoreSheet(scoreSheet).getScore(student, course);
        IScoreSheet(scoreSheet).setScore(student, _score + score, course);

        withdraw(student, _amount);
    }

    // 查询学生成绩
    function getScore(
        address student,
        string memory course
    ) external view returns (uint8) {
        return IScoreSheet(scoreSheet).getScore(student, course);
    }
}
