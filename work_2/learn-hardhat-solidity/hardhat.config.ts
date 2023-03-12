import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import path from 'path';

dotenv.config({path: path.resolve(__dirname,'./.env.local')});

const private_signer = process.env.PRIVATE_SINGER || "";
const private_other = process.env.PRIVATE_OTHER1 || "";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      chainId: 5,
      accounts: [private_signer, private_other],
    },
    bscTest: {
      url: "https://bsc-testnet.public.blastapi.io",
      chainId: 97,
      accounts: [private_signer, private_other],
    },
  },
  etherscan: {
    apiKey: process.env.ETHER_SCAN_API_KEY,
  },
};

export default config;
