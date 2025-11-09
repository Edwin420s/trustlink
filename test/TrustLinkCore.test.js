const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TrustLinkCore", function () {
  async function deployTrustLinkFixture() {
    const [owner, userA, userB, userC] = await ethers.getSigners();

    const TrustLinkCore = await ethers.getContractFactory("TrustLinkCore");
    const trustLinkCore = await TrustLinkCore.deploy();

    return { trustLinkCore, owner, userA, userB, userC };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { trustLinkCore } = await loadFixture(deployTrustLinkFixture);
      expect(await trustLinkCore.getTotalAgreements()).to.equal(0);
    });
  });

  describe("Agreement Creation", function () {
    it("Should create a new agreement", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await expect(trustLinkCore.connect(userA).createAgreement(userB.address))
        .to.emit(trustLinkCore, "AgreementCreated")
        .withArgs(1, userA.address, userB.address);

      expect(await trustLinkCore.getTotalAgreements()).to.equal(1);
    });

    it("Should reject zero address partner", async function () {
      const { trustLinkCore, userA } = await loadFixture(deployTrustLinkFixture);
      
      await expect(
        trustLinkCore.connect(userA).createAgreement(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(trustLinkCore, "InvalidAddress");
    });

    it("Should reject self agreement", async function () {
      const { trustLinkCore, userA } = await loadFixture(deployTrustLinkFixture);
      
      await expect(
        trustLinkCore.connect(userA).createAgreement(userA.address)
      ).to.be.revertedWithCustomError(trustLinkCore, "InvalidAddress");
    });

    it("Should track user agreements", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      
      const userAgreements = await trustLinkCore.getUserAgreements(userA.address);
      expect(userAgreements.length).to.equal(1);
      expect(userAgreements[0]).to.equal(1);
    });
  });

  describe("Agreement Acceptance", function () {
    it("Should accept agreement by partner", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      
      await expect(trustLinkCore.connect(userB).acceptAgreement(1))
        .to.emit(trustLinkCore, "AgreementAccepted")
        .withArgs(1, userB.address);

      const agreement = await trustLinkCore.getAgreement(1);
      expect(agreement.isActive).to.be.true;
    });

    it("Should reject acceptance by non-partner", async function () {
      const { trustLinkCore, userA, userB, userC } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      
      await expect(
        trustLinkCore.connect(userC).acceptAgreement(1)
      ).to.be.revertedWithCustomError(trustLinkCore, "NotAuthorized");
    });

    it("Should reject double acceptance", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      await expect(
        trustLinkCore.connect(userB).acceptAgreement(1)
      ).to.be.revertedWithCustomError(trustLinkCore, "AgreementAlreadyActive");
    });
  });

  describe("Proof Recording", function () {
    it("Should record proof under active agreement", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const documentHash = ethers.id("test-document");
      
      await expect(trustLinkCore.connect(userA).recordProof(1, documentHash))
        .to.emit(trustLinkCore, "ProofRecorded")
        .withArgs(1, documentHash, userA.address);
    });

    it("Should reject proof on inactive agreement", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      
      const documentHash = ethers.id("test-document");
      
      await expect(
        trustLinkCore.connect(userA).recordProof(1, documentHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "InvalidAgreement");
    });

    it("Should reject duplicate proof", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const documentHash = ethers.id("test-document");
      
      await trustLinkCore.connect(userA).recordProof(1, documentHash);
      
      await expect(
        trustLinkCore.connect(userA).recordProof(1, documentHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "ProofAlreadyExists");
    });

    it("Should reject proof by non-participant", async function () {
      const { trustLinkCore, userA, userB, userC } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const documentHash = ethers.id("test-document");
      
      await expect(
        trustLinkCore.connect(userC).recordProof(1, documentHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "NotAuthorized");
    });
  });

  describe("Proof Verification", function () {
    it("Should verify existing proof", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      const documentHash = ethers.id("test-document");
      await trustLinkCore.connect(userA).recordProof(1, documentHash);
      
      const [exists, timestamp, agreementId, submittedBy] = 
        await trustLinkCore.verifyProof(documentHash);
      
      expect(exists).to.be.true;
      expect(agreementId).to.equal(1);
      expect(submittedBy).to.equal(userA.address);
      expect(timestamp).to.be.gt(0);
    });

    it("Should return false for non-existent proof", async function () {
      const { trustLinkCore } = await loadFixture(deployTrustLinkFixture);
      
      const documentHash = ethers.id("non-existent-document");
      
      const [exists, timestamp, agreementId, submittedBy] = 
        await trustLinkCore.verifyProof(documentHash);
      
      expect(exists).to.be.false;
      expect(timestamp).to.equal(0);
      expect(agreementId).to.equal(0);
      expect(submittedBy).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Agreement Cancellation", function () {
    it("Should cancel agreement by participant", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      await expect(trustLinkCore.connect(userA).cancelAgreement(1))
        .to.emit(trustLinkCore, "AgreementCancelled")
        .withArgs(1, userA.address);

      expect(await trustLinkCore.isAgreementActive(1)).to.be.false;
    });

    it("Should reject cancellation by non-participant", async function () {
      const { trustLinkCore, userA, userB, userC } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      
      await expect(
        trustLinkCore.connect(userC).cancelAgreement(1)
      ).to.be.revertedWithCustomError(trustLinkCore, "NotAuthorized");
    });
  });

  describe("View Functions", function () {
    it("Should get agreement details", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      
      const agreement = await trustLinkCore.getAgreement(1);
      expect(agreement.id).to.equal(1);
      expect(agreement.initiator).to.equal(userA.address);
      expect(agreement.partner).to.equal(userB.address);
      expect(agreement.isActive).to.be.false;
    });

    it("Should check agreement active status", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      expect(await trustLinkCore.isAgreementActive(1)).to.be.false;
      
      await trustLinkCore.connect(userB).acceptAgreement(1);
      expect(await trustLinkCore.isAgreementActive(1)).to.be.true;
    });
  });
});
