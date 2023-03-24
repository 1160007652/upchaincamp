import { expect } from "chai";
import { ethers } from "hardhat";
import { Token, Vault } from "../typechain-types";

let vault: Vault;
let usdt: Token;
let dog: Token;


describe("Vault", function () {

  beforeEach(async function () {

    // 共享一份独立合约
    if (vault) return false;
    
    const Vault = await ethers.getContractFactory("Vault");
    const Token = await ethers.getContractFactory("Token");


    vault = await Vault.deploy(); 
    await vault.deployed();

    usdt = await Token.deploy("USDT", "USDT"); 
    await usdt.deployed();

    dog = await Token.deploy("DOG", "DOG"); 
    await dog.deployed();

    console.log(`  Vault address : ${vault.address}`);
    console.log(`  USDT Token address : ${usdt.address}`);
    console.log(`  DOG Token address : ${dog.address}`);

  });

  it("合约设置的权限是否正确", async function () {
    const [owner] = await ethers.getSigners();
    expect(await vault.owner()).to.equal(owner.address);
  });

  it("检查Valut中的存款", async function () {
    const [owner, alice] = await ethers.getSigners();

    expect(await vault.balanceOf(owner.address, usdt.address)).to.equal(0);
    expect(await vault.balanceOf(owner.address, dog.address)).to.equal(0);
    expect(await vault.balanceOf(alice.address, usdt.address)).to.equal(0);
    expect(await vault.balanceOf(alice.address, dog.address)).to.equal(0);

  });

  it("测试存款", async function () {
    const [owner] = await ethers.getSigners();

    const amount = 100;
    // 授权
    const usdtApprove = await usdt.approve(vault.address, amount);
    await usdtApprove.wait();
    // 存款
    const depositeUsdt = await vault.deposite(usdt.address, amount);
    await depositeUsdt.wait();

    // 授权
    const dogApprove = await dog.approve(vault.address, amount);
    await dogApprove.wait();
    // 存款
    const depositeDog = await vault.deposite(dog.address, amount);
    await depositeDog.wait();

    expect(await vault.balanceOf(owner.address, usdt.address)).to.equal(amount);
    expect(await vault.balanceOf(owner.address, dog.address)).to.equal(amount);
   

  });

  it("提取存款", async function () {
    const [owner] = await ethers.getSigners();

    const withdrawAmount = 30;
    const depositedAmount = 70;

    
    // 提取存款
    const withdrawUsdt = await vault.withdraw(usdt.address, withdrawAmount);
    await withdrawUsdt.wait();

    // 提取存款
    const withdrawDog = await vault.withdraw(dog.address, withdrawAmount);
    await withdrawDog.wait();

    expect(await vault.balanceOf(owner.address, usdt.address)).to.equal(depositedAmount);
    expect(await vault.balanceOf(owner.address, dog.address)).to.equal(depositedAmount);
   

  });

})