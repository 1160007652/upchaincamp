import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT } from "../typechain-types";

let nft: NFT;

describe("NFT", function () {

  beforeEach(async function () {

    // 共享一份独立合约
    if (nft) return false;
    
    const NFT = await ethers.getContractFactory("NFT");
    const Token = await ethers.getContractFactory("Token");

    nft = await NFT.deploy("Muniz NFT", "mz"); 
    await nft.deployed();

    console.log(`  Vault address : ${nft.address}`);
   
  });

  it("mint nft", async function () {
    const [owner] = await ethers.getSigners();
    const tokenID = await nft.balanceOf(owner.address);
    const tsx = await nft.mint(owner.address, JSON.stringify({name: "alice", image: "https://www.alice.com/avatar"}));
    await tsx.wait();
    expect(tsx.value).to.equal(tokenID);
  });

  it("获取NFT 拥有者", async function () {
    const [owner] = await ethers.getSigners();

    const tokenID = await nft.balanceOf(owner.address);
    console.log(tokenID)
    expect(await nft.ownerOf(tokenID)).to.equal(owner.address);
   
  });

  it("获取NFT URI", async function () {
    const [owner] = await ethers.getSigners();

    const tokenID = await nft.balanceOf(owner.address);
    const tokenURI = await nft.tokenURI(tokenID);
    const tokenURIJSON = JSON.parse(tokenURI);
    console.log(tokenURIJSON);
    expect(tokenURIJSON.name).to.equal("alice");
   
  });

})