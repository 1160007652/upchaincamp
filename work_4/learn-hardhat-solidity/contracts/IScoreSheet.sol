// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IScoreSheet {
    event SetScore(address indexed student, uint8 score, string course);

    /**
     * 设置学生成绩,
     * @param student 学生地址，表示学生昵称
     * @param score 成绩
     * @param course 课目
     *
     */
    function setScore(
        address student,
        uint8 score,
        string memory course
    ) external;

    /**
     * 获取学生成绩
     * @param student 学生地址，表示昵称
     * @param course 课目
     */
    function getScore(
        address student,
        string memory course
    ) external view returns (uint8);
}
