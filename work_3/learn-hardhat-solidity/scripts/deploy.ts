import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const Bank = await ethers.getContractFactory("Bank", owner);

  // 部署合约时直接存入钱
  const bank = await Bank.deploy({value: '1'});

  await bank.deployed();

  console.log(`Bank deployed to ${bank.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
