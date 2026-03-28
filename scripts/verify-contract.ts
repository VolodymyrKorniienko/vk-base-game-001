import pkg from "hardhat";
import { ethers } from "ethers";

async function main() {
  const contractAddress = "0xf6D4D0624a4d983A38DFe310A998fb810882ddD7";
  
  // Connect to Base Mainnet
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  
  // Get contract code to verify deployment
  const code = await provider.getCode(contractAddress);
  
  if (code === "0x") {
    console.log("❌ Contract NOT deployed at:", contractAddress);
  } else {
    console.log("✅ Contract deployed at:", contractAddress);
    console.log("Code length:", code.length, "bytes");
  }
  
  // Try to read MAX_MOVES_FOR_REWARD (if contract matches our ABI)
  try {
    const MAX_MOVES_FOR_REWARD_SLOT = 0; // First constant
    const contract = new ethers.Contract(contractAddress, [
      "function MAX_MOVES_FOR_REWARD() view returns (uint256)",
      "function name() view returns (string)",
      "function symbol() view returns (string)"
    ], provider);
    
    const maxMoves = await contract.MAX_MOVES_FOR_REWARD();
    const name = await contract.name();
    const symbol = await contract.symbol();
    
    console.log("\n📋 Contract Info:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("MAX_MOVES_FOR_REWARD:", maxMoves.toString());
  } catch (err) {
    console.log("\n⚠️ Could not read contract methods:", (err as Error).message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
