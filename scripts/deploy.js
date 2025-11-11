const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting TrustLink contract deployment...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.provider.getBalance(deployer.address)).toString()}`);

  // Deploy TrustLinkCore
  console.log("\n📄 Deploying TrustLinkCore...");
  const TrustLinkCore = await ethers.getContractFactory("TrustLinkCore");
  const trustLinkCore = await TrustLinkCore.deploy();
  await trustLinkCore.waitForDeployment();
  const coreAddress = await trustLinkCore.getAddress();
  console.log(`✅ TrustLinkCore deployed to: ${coreAddress}`);

  // Deploy TrustLinkRegistry
  console.log("\n📋 Deploying TrustLinkRegistry...");
  const TrustLinkRegistry = await ethers.getContractFactory("TrustLinkRegistry");
  const trustLinkRegistry = await TrustLinkRegistry.deploy(coreAddress);
  await trustLinkRegistry.waitForDeployment();
  const registryAddress = await trustLinkRegistry.getAddress();
  console.log(`✅ TrustLinkRegistry deployed to: ${registryAddress}`);

  // Deploy ProofVerifier
  console.log("\n🔍 Deploying ProofVerifier...");
  const ProofVerifier = await ethers.getContractFactory("ProofVerifier");
  const proofVerifier = await ProofVerifier.deploy(coreAddress);
  await proofVerifier.waitForDeployment();
  const verifierAddress = await proofVerifier.getAddress();
  console.log(`✅ ProofVerifier deployed to: ${verifierAddress}`);

  // Verification step
  console.log("\n🔎 Verifying deployments...");
  const coreAgreementCount = await trustLinkCore.getTotalAgreements();
  console.log(`Initial agreement count: ${coreAgreementCount}`);

  console.log("\n🎉 TrustLink deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log(`TrustLinkCore: ${coreAddress}`);
  console.log(`TrustLinkRegistry: ${registryAddress}`);
  console.log(`ProofVerifier: ${verifierAddress}`);

  // Prepare for frontend configuration
  console.log("\n📝 Frontend Configuration:");
  console.log(`VITE_TRUSTLINK_CORE=${coreAddress}`);
  console.log(`VITE_TRUSTLINK_REGISTRY=${registryAddress}`);
  console.log(`VITE_TRUSTLINK_VERIFIER=${verifierAddress}`);

  // Auto-inject addresses into frontend .env
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '../frontend/.env');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add contract addresses
    const updates = {
      'VITE_TRUSTLINK_CORE_ADDRESS': coreAddress,
      'VITE_TRUSTLINK_REGISTRY_ADDRESS': registryAddress,
      'VITE_PROOF_VERIFIER_ADDRESS': verifierAddress
    };

    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    });

    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log("\n✅ Contract addresses auto-injected into frontend/.env");
  } catch (error) {
    console.warn("\n⚠️  Could not auto-inject to .env:", error.message);
    console.log("Please manually update frontend/.env with the addresses above");
  }

  return {
    trustLinkCore: coreAddress,
    trustLinkRegistry: registryAddress,
    proofVerifier: verifierAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });