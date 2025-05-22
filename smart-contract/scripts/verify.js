const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const droppioAddress = process.env.DROPPIO_ADDRESS;
  const droppioSBTAddress = process.env.DROPPIO_SBT_ADDRESS;
  const idrxTokenAddress = process.env.IDRX_TOKEN_ADDRESS;
  const ipfsBaseURI = process.env.IPFS_BASE_URI;

  // Buat file verifikasi manual
  const verificationInfo = {
    Droppio: {
      address: droppioAddress,
      constructorArguments: [idrxTokenAddress],
      contractPath: "contracts/Droppio.sol",
    },
    DroppioSBT: {
      address: droppioSBTAddress,
      constructorArguments: [droppioAddress, ipfsBaseURI],
      contractPath: "contracts/DroppioSBT.sol",
    }
  };

  // Simpan informasi verifikasi ke file
  const verificationPath = path.join(__dirname, "verification-info.json");
  fs.writeFileSync(verificationPath, JSON.stringify(verificationInfo, null, 2));

  console.log("Verification information saved to:", verificationPath);
  console.log("\nUntuk verifikasi manual di Lisk Sepolia Blockscout:");
  console.log("1. Buka https://sepolia-blockscout.lisk.com");
  console.log("2. Cari kontrak dengan alamat:", droppioAddress);
  console.log("3. Klik tab 'Contract'");
  console.log("4. Klik 'Verify & Publish'");
  console.log("5. Pilih 'Solidity (Single file)'");
  console.log("6. Copy-paste source code dari file kontrak yang sesuai");
  console.log("7. Isi constructor arguments sesuai dengan yang ada di verification-info.json");
  console.log("\nUlangi proses yang sama untuk kontrak DroppioSBT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 