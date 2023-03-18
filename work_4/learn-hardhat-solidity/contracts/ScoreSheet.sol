// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./IScoreSheet.sol";

contract ScoreSheet is IScoreSheet {
    // 存储老师地址
    address public teacher;
    // 映射表，表示 { 学生地址 : { 课目: 分数 } }
    mapping(address => mapping(string => uint8)) public scores;

    // 定义错误抛出
    error InvalidScore();

    // 构造函数
    constructor() payable {
        teacher = msg.sender;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "You aren't the teacher");
        _;
    }

    function setScore(
        address student,
        uint8 score,
        string memory course
    ) external onlyTeacher {
        if (score > 100) revert InvalidScore();
        scores[student][course] = score;
        emit SetScore(student, score, course);
    }

    function getScore(
        address student,
        string memory course
    ) external view returns (uint8) {
        return scores[student][course];
    }
}
