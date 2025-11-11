const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TrustLinkCore - Advanced Features", function () {
  async function deployTrustLinkFixture() {
    const [owner, userA, userB, userC] = await ethers.getSigners();

    const TrustLinkCore = await ethers.getContractFactory("TrustLinkCore");
    const trustLinkCore = await TrustLinkCore.deploy();

    return { trustLinkCore, owner, userA, userB, userC };
  }

  describe("Bilateral Acknowledgement", function () {
    it("Should record proof with bilateral ack requirement", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      // Create and accept agreement
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      
      await expect(trustLinkCore.connect(userA).recordProofWithAck(1, docHash))
        .to.emit(trustLinkCore, "ProofRecorded")
        .withArgs(1, docHash, userA.address);

      const proof = await trustLinkCore.getProof(docHash);
      expect(proof.requiresBilateralAck).to.be.true;
      expect(proof.acknowledgedByPartner).to.be.false;
    });

    it("Should allow partner to acknowledge proof", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProofWithAck(1, docHash);

      await expect(trustLinkCore.connect(userB).acknowledgeProof(docHash))
        .to.emit(trustLinkCore, "ProofAcknowledged")
        .withArgs(docHash, userB.address);

      const proof = await trustLinkCore.getProof(docHash);
      expect(proof.acknowledgedByPartner).to.be.true;
    });

    it("Should reject acknowledgement from submitter", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProofWithAck(1, docHash);

      await expect(
        trustLinkCore.connect(userA).acknowledgeProof(docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "CannotAcknowledgeOwnProof");
    });

    it("Should reject duplicate acknowledgement", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProofWithAck(1, docHash);
      await trustLinkCore.connect(userB).acknowledgeProof(docHash);

      await expect(
        trustLinkCore.connect(userB).acknowledgeProof(docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "ProofAlreadyAcknowledged");
    });
  });

  describe("Proof Revocation", function () {
    it("Should allow participants to propose revocation", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      await expect(trustLinkCore.connect(userA).proposeRevocation(docHash))
        .to.emit(trustLinkCore, "ProofRevocationProposed")
        .withArgs(docHash, userA.address);
    });

    it("Should allow participant to revoke proof", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      await expect(trustLinkCore.connect(userA).revokeProof(docHash))
        .to.emit(trustLinkCore, "ProofRevoked")
        .withArgs(docHash, userA.address);

      const proof = await trustLinkCore.getProof(docHash);
      expect(proof.isRevoked).to.be.true;
    });

    it("Should prevent revocation by non-participant", async function () {
      const { trustLinkCore, userA, userB, userC } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      await expect(
        trustLinkCore.connect(userC).revokeProof(docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "NotAuthorized");
    });

    it("Should reject duplicate revocation", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);
      await trustLinkCore.connect(userA).revokeProof(docHash);

      await expect(
        trustLinkCore.connect(userA).revokeProof(docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "ProofAlreadyRevoked");
    });
  });

  describe("Agreement Cancellation", function () {
    it("Should allow participant to cancel agreement", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      await expect(trustLinkCore.connect(userA).cancelAgreement(1))
        .to.emit(trustLinkCore, "AgreementCancelled")
        .withArgs(1, userA.address);

      const isActive = await trustLinkCore.isAgreementActive(1);
      expect(isActive).to.be.false;
    });

    it("Should prevent proof recording after cancellation", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);
      await trustLinkCore.connect(userA).cancelAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));

      await expect(
        trustLinkCore.connect(userA).recordProof(1, docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "InvalidAgreement");
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

  describe("Salted Hash Generation", function () {
    it("Should generate salted hash correctly", async function () {
      const { trustLinkCore } = await loadFixture(deployTrustLinkFixture);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      const agreementId = 1;

      const saltedHash = await trustLinkCore.generateSaltedHash(docHash, agreementId);
      
      // Verify it matches solidity keccak256(abi.encodePacked(docHash, agreementId))
      const expected = ethers.keccak256(
        ethers.solidityPacked(['bytes32', 'uint256'], [docHash, agreementId])
      );
      
      expect(saltedHash).to.equal(expected);
    });

    it("Should produce different hashes for different agreements", async function () {
      const { trustLinkCore } = await loadFixture(deployTrustLinkFixture);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      
      const saltedHash1 = await trustLinkCore.generateSaltedHash(docHash, 1);
      const saltedHash2 = await trustLinkCore.generateSaltedHash(docHash, 2);
      
      expect(saltedHash1).to.not.equal(saltedHash2);
    });
  });

  describe("Proof Details Retrieval", function () {
    it("Should return full proof struct via getProof", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      const proof = await trustLinkCore.getProof(docHash);
      
      expect(proof.documentHash).to.equal(docHash);
      expect(proof.agreementId).to.equal(1);
      expect(proof.submittedBy).to.equal(userA.address);
      expect(proof.requiresBilateralAck).to.be.false;
      expect(proof.acknowledgedByPartner).to.be.false;
      expect(proof.isRevoked).to.be.false;
    });

    it("Should revert on getProof for non-existent hash", async function () {
      const { trustLinkCore } = await loadFixture(deployTrustLinkFixture);
      
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent"));

      await expect(
        trustLinkCore.getProof(docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "ProofNotExists");
    });
  });

  describe("Only Participant Modifier", function () {
    it("Should prevent non-participant from recording proof", async function () {
      const { trustLinkCore, userA, userB, userC } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));

      await expect(
        trustLinkCore.connect(userC).recordProof(1, docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "NotAuthorized");
    });
  });

  describe("Duplicate Proof Prevention", function () {
    it("Should reject duplicate proof hash", async function () {
      const { trustLinkCore, userA, userB } = await loadFixture(deployTrustLinkFixture);
      
      await trustLinkCore.connect(userA).createAgreement(userB.address);
      await trustLinkCore.connect(userB).acceptAgreement(1);

      const docHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      await trustLinkCore.connect(userA).recordProof(1, docHash);

      await expect(
        trustLinkCore.connect(userA).recordProof(1, docHash)
      ).to.be.revertedWithCustomError(trustLinkCore, "ProofAlreadyExists");
    });
  });
});
