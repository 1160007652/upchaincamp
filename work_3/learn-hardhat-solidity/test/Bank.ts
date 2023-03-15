import { expect } from "chai";
import { ethers } from "hardhat";
import { Bank } from "../typechain-types";

let bank: Bank;

describe("硅谷银行", function () {

  beforeEach(async function () {
    const [owner] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("Bank", owner);

    // 部署合约时直接存入钱
    bank = await Bank.deploy({value: '1'}); 
    await bank.deployed();
  });

  it("合约设置的权限是否正确", async function () {
    const [owner] = await ethers.getSigners();
    expect(await bank.owner()).to.equal(owner.address);
  });

  it("首次部署合约时，owner存入 1 wei", async function () {
    const [owner] = await ethers.getSigners();
    expect(await bank.balance()).to.equal(1);
    expect(await bank.balances(owner.address)).to.equal(1);
  });

  it("Alice 存入硅谷银行 2 wei", async function () {
    const [owner, alice] = await ethers.getSigners();

    const amount = '2'; // 2 wei
    // alice 存入 2 wei
    const tsx = await bank.connect(alice).deposit({value: amount});
    await tsx.wait();

    expect(await bank.connect(alice).balance()).to.equal(amount);
    expect(await bank.connect(alice).balances(alice.address)).to.equal(amount);

  });

  it("Alice 存入硅谷银行 1 wei", async function () {
    const [owner, alice] = await ethers.getSigners();

    // alice 存入银行 1 wei
    const tsx = await alice.sendTransaction({to: bank.address, value: '1'});
    await tsx.wait();

    expect(await bank.connect(alice).balance()).to.equal('1');
  });

  it("Alice 存入硅谷银行 4 wei, 提取 1 wei, 剩余 3 wei", async function () {
    const [owner, alice] = await ethers.getSigners();

    // alice 存入 4 wei
    let tsx = await bank.connect(alice).deposit({value: '4'});
    await tsx.wait();

    expect(await bank.connect(alice).balance()).to.equal('4');

    // 从银行提取 1 wei 存款
    tsx = await bank.connect(alice).withdraw('1');
    await tsx.wait();

    expect(await bank.connect(alice).balances(alice.address)).to.equal('3');

  });

  it("Alice 将硅谷银行 2 wei 存款，全部提现到 owner 中", async function () {
    const [owner, alice] = await ethers.getSigners();

    const ownerBalance = await owner.getBalance();
    const amount = '4'; // 4 wei

    let tsx = await bank.connect(alice).deposit({value: amount});
    await tsx.wait();

    tsx = await bank.connect(alice).withdrawByOuther(owner.address);
    await tsx.wait();

    // alice 目前存款有 0 wei
    expect(await bank.connect(alice).balance()).to.equal('0');

    // owner 目前存款有 之前的余额 + 4 wei
    expect(await owner.getBalance()).to.equal(ethers.BigNumber.from(ownerBalance).add(amount));

  });
  
})