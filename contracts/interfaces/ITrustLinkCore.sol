// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITrustLinkCore {
    struct Agreement {
        uint256 id;
        address initiator;
        address partner;
        bool isActive;
        uint256 createdAt;
    }

    struct Proof {
        uint256 agreementId;
        bytes32 documentHash;
        uint256 timestamp;
        address submittedBy;
    }

    function createAgreement(address _partner) external returns (uint256);
    function acceptAgreement(uint256 _agreementId) external;
    function recordProof(uint256 _agreementId, bytes32 _documentHash) external;
    function verifyProof(bytes32 _documentHash) external view returns (bool, uint256, uint256, address);
    function getUserAgreements(address _user) external view returns (uint256[] memory);
    function agreements(uint256) external view returns (uint256, address, address, bool, uint256);
    function proofs(bytes32) external view returns (uint256, bytes32, uint256, address);
}