const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TrustLinkRegistry", function () {
  async function deployRegistryFixture() {
    const [owner, userA, userB, userC] = await ethers.getSigners();

    const TrustLinkCore = await ethers.getContractFactory("TrustLinkCore");
    const trustLinkCore = await TrustLinkCore.deploy();

    const TrustLinkRegistry = await ethers.getContractFactory("TrustLinkRegistry");
    const trustLinkRegistry = await TrustLinkRegistry.deploy(await trustLinkCore.getAddress());

    return { trustLinkCore, trustLinkRegistry, owner, userA, userB, userC };
  }

  describe("Proof Visibility Management", function () {
    it("Should set proof to public", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB } = await loadFixture(deployRegistryFixture);
      
      // Create agreement and proof
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      // Set to public
      await expect(trustLinkRegistry.connect(userA).setProofVisibility(docHash, true))
        .to.emit(trustLinkRegistry, "ProofVisibilitySet")
        .withArgs(docHash, true, userA.address)
        .and.to.emit(trustLinkRegistry, "PublicProofAdded")
        .withArgs(docHash, userA.address);

      expect(await trustLinkRegistry.isProofPublic(docHash)).to.be.true;
    });

    it("Should prevent duplicate entries when toggling visibility", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB } = await loadFixture(deployRegistryFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      // Set to public
      await trustLinkRegistry.connect(userA).setProofVisibility(docHash, true);
      let count1 = await trustLinkRegistry.getUserPublicProofCount(userA.address);

      // Toggle to private
      await trustLinkRegistry.connect(userA).setProofVisibility(docHash, false);
      let count2 = await trustLinkRegistry.getUserPublicProofCount(userA.address);

      // Toggle back to public
      await trustLinkRegistry.connect(userA).setProofVisibility(docHash, true);
      let count3 = await trustLinkRegistry.getUserPublicProofCount(userA.address);

      expect(count1).to.equal(1);
      expect(count2).to.equal(0);
      expect(count3).to.equal(1);
    });

    it("Should only allow proof owner to change visibility", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB, userC } = await loadFixture(deployRegistryFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      await expect(
        trustLinkRegistry.connect(userC).setProofVisibility(docHash, true)
      ).to.be.revertedWithCustomError(trustLinkRegistry, "NotProofOwner");
    });

    it("Should reject visibility change for non-existent proof", async function () {
      const { trustLinkRegistry, userA } = await loadFixture(deployRegistryFixture);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent"));

      await expect(
        trustLinkRegistry.connect(userA).setProofVisibility(docHash, true)
      ).to.be.revertedWithCustomError(trustLinkRegistry, "ProofNotExists");
    });
  });

  describe("Public Proof Verification", function () {
    it("Should verify public proof successfully", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB } = await loadFixture(deployRegistryFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);
      await trustLinkRegistry.connect(userA).setProofVisibility(docHash, true);

      const [verified, timestamp, agreementId, submittedBy] = 
        await trustLinkRegistry.verifyPublicProof(docHash);

      expect(verified).to.be.true;
      expect(agreementId).to.equal(1);
      expect(submittedBy).to.equal(userA.address);
    });

    it("Should return false for private proof", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB } = await loadFixture(deployRegistryFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      const [verified] = await trustLinkRegistry.verifyPublicProof(docHash);
      expect(verified).to.be.false;
    });

    it("Should return false for non-existent proof", async function () {
      const { trustLinkRegistry } = await loadFixture(deployRegistryFixture);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent"));

      const [verified] = await trustLinkRegistry.verifyPublicProof(docHash);
      expect(verified).to.be.false;
    });
  });

  describe("User Public Proofs Retrieval", function () {
    it("Should return all public proofs for a user", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB } = await loadFixture(deployRegistryFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("doc1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("doc2"));
      
      await trustLinkCore.connect(userA).recordProof(1, hash1);
      await trustLinkCore.connect(userA).recordProof(1, hash2);
      
      await trustLinkRegistry.connect(userA).setProofVisibility(hash1, true);
      await trustLinkRegistry.connect(userA).setProofVisibility(hash2, true);

      const publicProofs = await trustLinkRegistry.getUserPublicProofs(userA.address);
      expect(publicProofs.length).to.equal(2);
      expect(publicProofs).to.include(hash1);
      expect(publicProofs).to.include(hash2);
    });

    it("Should return correct public proof count", async function () {
      const { trustLinkCore, trustLinkRegistry, userA, userB } = await loadFixture(deployRegistryFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("doc1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("doc2"));
      const hash3 = ethers.keccak256(ethers.toUtf8Bytes("doc3"));
      
      await trustLinkCore.connect(userA).recordProof(1, hash1);
      await trustLinkCore.connect(userA).recordProof(1, hash2);
      await trustLinkCore.connect(userA).recordProof(1, hash3);
      
      await trustLinkRegistry.connect(userA).setProofVisibility(hash1, true);
      await trustLinkRegistry.connect(userA).setProofVisibility(hash2, true);

      const count = await trustLinkRegistry.getUserPublicProofCount(userA.address);
      expect(count).to.equal(2);
    });
  });
});
