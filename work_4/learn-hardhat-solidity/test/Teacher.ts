import { expect } from "chai";
import { ethers } from "hardhat";
import { ScoreSheet, Teacher } from "../typechain-types";

let teacher: Teacher;
let scoreSheet: ScoreSheet;

describe("登链学堂", function () {

  beforeEach(async function () {

    // 共享一份独立合约
    if (teacher) return false;
    
    const [owner] = await ethers.getSigners();
    const Teacher = await ethers.getContractFactory("Teacher", owner);

    teacher = await Teacher.deploy(); 
    await teacher.deployed();

    const scoreSheetAddress = await teacher.scoreSheet();
    scoreSheet = await ethers.getContractAt("ScoreSheet", scoreSheetAddress, owner);
    console.log(`  教师 : ${teacher.address}`);
    console.log(`  学生成绩表 : ${scoreSheetAddress}`);

  });

  it("合约设置的权限是否正确", async function () {
    const [owner] = await ethers.getSigners();
    expect(await teacher.owner()).to.equal(owner.address);
  });

  it("老师设置学生成绩 80 分", async function () {
    const [owner, student] = await ethers.getSigners();
    const tsx = await teacher.setScore(student.address, 80, "语文");
    await tsx.wait();

    expect(await teacher.getScore(student.address, "语文")).to.equal(80);
  });

  it("不允许，老师设置的 学生成绩 > 100 分", async function () {
    const [owner, student] = await ethers.getSigners();
    await expect(teacher.setScore(student.address, 101, "语文")).revertedWithCustomError(scoreSheet, "InvalidScore");
  });

  it("老师读取学生成绩", async function () {
    const [owner, student] = await ethers.getSigners();
    expect(await teacher.getScore(student.address, "语文")).to.equal(80);
  });


  it("检查学生成绩表的权限, 是否是 Teacher 的合约地址", async function () {
    expect(await scoreSheet.teacher()).to.equal(teacher.address);

  });

  it("学生获取分数", async function () {
    const [owner,student] = await ethers.getSigners();
    await expect(await scoreSheet.connect(student).getScore(student.address, "语文")).to.equal(80);
    expect(await teacher.getScore(student.address, "语文")).to.equal(80);
  });

  it("学生打分不成功，不是教师", async function () {
    const [owner,student] = await ethers.getSigners();
    await expect(scoreSheet.setScore(student.address, 80, "语文")).revertedWith("You aren't the teacher");
    await expect(teacher.connect(student).setScore(student.address, 80, "语文")).revertedWith("You aren't the owner");
  });


  it("不及格，没办法只能买分上大学", async function () {
    const [owner, student] = await ethers.getSigners();

    // 买分钱
    const buyScoreAmount = 4;

    // 买1分
    const buyScore = 1;

    // 市场买分 价格
    const buyScoreMarket = await teacher.buySocreAmount();

    // 存入买分钱
    let tsx = await teacher.connect(student).deposit({value: buyScoreAmount});
    await tsx.wait();

    // 验证是否存入成功
    expect(await teacher.connect(student).balance()).to.equal(buyScoreAmount);

    // 英语59分，准备买1分，及格
    tsx = await teacher.setScore(student.address, 59, "英语");
    await tsx.wait();

    // 买分

    await expect(teacher.setScoreByBuy(student.address, 1, "英语")).not.revertedWithCustomError(teacher, "BuyScoreByNotAmount");

    // 判断 分数是否及格
    expect(await teacher.getScore(student.address, "英语")).to.equal(60);

    // expect(await owner.getBalance()).to.equal(buyScoreMarket.mul(buyScore));

  });

})