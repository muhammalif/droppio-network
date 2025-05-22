const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Deploy Droppio contract first
  const IDRX_TOKEN_ADDRESS = process.env.IDRX_TOKEN_ADDRESS; // Make sure to set this in .env
  console.log("Deploying Droppio contract...");
  const Droppio = await hre.ethers.getContractFactory("Droppio");
  const droppio = await Droppio.deploy(IDRX_TOKEN_ADDRESS);
  await droppio.waitForDeployment();
  const droppioAddress = await droppio.getAddress();
  console.log("Droppio deployed to:", droppioAddress);

  // Deploy DroppioSBT contract
  const IPFS_BASE_URI = process.env.IPFS_BASE_URI; // Make sure to set this in .env
  console.log("Deploying DroppioSBT contract...");
  const DroppioSBT = await hre.ethers.getContractFactory("DroppioSBT");
  const droppioSBT = await DroppioSBT.deploy(droppioAddress, IPFS_BASE_URI);
  await droppioSBT.waitForDeployment();
  const droppioSBTAddress = await droppioSBT.getAddress();
  console.log("DroppioSBT deployed to:", droppioSBTAddress);

  console.log("Deployment completed!");
  console.log("Droppio:", droppioAddress);
  console.log("DroppioSBT:", droppioSBTAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 