import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying BaseMemoryGame with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const BaseMemoryGame = await ethers.getContractFactory("BaseMemoryGame");
  const game = await BaseMemoryGame.deploy();

  await game.waitForDeployment();

  const address = await game.getAddress();
  console.log("BaseMemoryGame deployed to:", address);
  console.log("");
  console.log("Next steps:");
  console.log(`1. Add to .env: NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log("2. Add NEXT_PUBLIC_CONTRACT_ADDRESS to Vercel environment variables");
  console.log("3. Redeploy the app");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
