import { ethers } from "hardhat";

async function main() {
  // Deploy Groth16Verifier
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Groth16Verifier.deploy();
  await verifier.deployed();
  console.log("Groth16Verifier deployed to:", verifier.address);

  // Deploy AnonymousVoting
  const AnonymousVoting = await ethers.getContractFactory("AnonymousVoting");
  const anonymousVoting = await AnonymousVoting.deploy(verifier.address);
  await anonymousVoting.deployed();
  console.log("AnonymousVoting deployed to:", anonymousVoting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
