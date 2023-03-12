import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter } from "../typechain-types";

describe("Counter", function () {
  
  let counter: Counter;

  beforeEach(async function () {
    const [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter", owner);
    counter = await Counter.deploy();
    await counter.deployed();
  });

  it("合约设置的权限是否正确", async function () {
    const [owner] = await ethers.getSigners();
    expect(await counter.owner()).to.equal(owner.address);
  });

  it("合约中的 counter 值, 应该为0", async function () {
    expect(await counter.counter()).to.equal(0);
  });

  it("调用 count 方法, 此时counter值应该为1", async function () {
    await counter.count();
    expect(await counter.counter()).to.equal(1);
  });

  it("检查合约中 count 方法的调用权限", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    await expect(await counter.connect(otherAccount).count()).to.be.revertedWith("You aren't the owner");
  });
  
})