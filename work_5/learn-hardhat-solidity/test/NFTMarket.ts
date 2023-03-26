import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Token, NFTMarket, NFT } from "../typechain-types";

let nftMarket: NFTMarket;
let usdt: Token;
let nft: NFT;

let tokenId = 1; // mint 出的 第一个 NFT


describe("NFTMarket", function () {

  beforeEach(async function () {
    const [owner, alice] = await ethers.getSigners();
    // 共享一份独立合约
    if (nftMarket) return false;
    
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const Token = await ethers.getContractFactory("Token");
    const NFT = await ethers.getContractFactory("NFT");



    usdt = await Token.deploy("USDT", "USDT"); 
    await usdt.deployed();

    nftMarket = await NFTMarket.deploy(usdt.address); 
    await nftMarket.deployed();


    nft = await NFT.deploy("NFT test", "tNFT"); 
    await nft.deployed();

    console.log(`  Vault address : ${nftMarket.address}`);
    console.log(`  USDT Token address : ${usdt.address}`);
    console.log(`  DOG Token address : ${nft.address}`);

    // mint NFT
    const tsx = await nft.mint(owner.address, JSON.stringify({name: "alice", image: "https://www.alice.com/avatar"}));
    await tsx.wait();
    usdt.transfer(alice.address, ethers.utils.parseEther('1'));

  });

  it("NFTMarket 付款代币是否正确", async function () {
    expect(await nftMarket.tokenContractAddress()).to.equal(usdt.address);
  });

  it("是否 拥有 NFT", async function () {
    const [owner] = await ethers.getSigners();
    expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
  });



  it("Owner 出售NFT", async function () {
    await nft.approve(nftMarket.address, tokenId);
    // await nft.setApprovalForAll(nftMarket.address,true);
    await nftMarket.addNFTForSale(nft.address, tokenId, '100');
    expect( await nft.ownerOf(tokenId)).to.equal(nftMarket.address);
  });

  it("Alice 是否有 1 Eth ", async function () {
    const [owner, alice] = await ethers.getSigners();
   
    expect( await usdt.balanceOf(alice.address)).to.equal(ethers.utils.parseEther('1'));
  });

  it("Alice 购买NFT", async function () {
    const [owner, alice] = await ethers.getSigners();
   
    await usdt.connect(alice).approve(nftMarket.address, '100');

    await nftMarket.connect(alice).buyNFT(nft.address, tokenId, '100')
   
    expect( await nft.ownerOf(tokenId)).to.equal(alice.address);
  });

  it("Alice 出售NFT", async function () {
    const [owner, alice] = await ethers.getSigners();
    await nft.connect(alice).approve(nftMarket.address, tokenId);
    await nftMarket.connect(alice).addNFTForSale(nft.address, tokenId, '100');
    expect( await nft.ownerOf(tokenId)).to.equal(nftMarket.address);
  });


  it("Alice 取消出售的NFT", async function () {
    const [owner, alice] = await ethers.getSigners();
    await nftMarket.connect(alice).removeNFTFromSale(nft.address, tokenId);
    expect( await nft.ownerOf(tokenId)).to.equal(alice.address);
  });


})