import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const Teacher = await ethers.getContractFactory("Teacher", owner);

  const teacher = await Teacher.deploy();

  await teacher.deployed();

  console.log(`Teacher deployed to ${teacher.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
