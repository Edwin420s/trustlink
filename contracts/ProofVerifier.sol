// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ITrustLinkCore.sol";

/**
 * @title ProofVerifier
 * @dev Lightweight verification contract for external applications
 * @notice Provides simple read-only verification interface for dApps and external services
 */
contract ProofVerifier {
    ITrustLinkCore public trustLinkCore;

    event ProofVerified(bytes32 indexed documentHash, address verifiedBy, uint256 timestamp);

    constructor(address _trustLinkCoreAddress) {
        trustLinkCore = ITrustLinkCore(_trustLinkCoreAddress);
    }

    /**
     * @notice Simple proof verification with event emission
     * @param _documentHash The document hash to verify
     * @return exists Whether the proof exists
     * @return timestamp When the proof was recorded
     * @return submittedBy Who submitted the proof
     */
    function verify(bytes32 _documentHash) 
        external 
        returns (bool exists, uint256 timestamp, address submittedBy) 
    {
        (bool proofExists, uint256 time,, address owner) = trustLinkCore.verifyProof(_documentHash);
        
        if (proofExists) {
            emit ProofVerified(_documentHash, msg.sender, block.timestamp);
        }
        
        return (proofExists, time, owner);
    }

    /**
     * @notice Batch verify multiple document hashes
     * @param _documentHashes Array of document hashes to verify
     * @return results Array of verification results
     */
    function batchVerify(bytes32[] calldata _documentHashes) 
        external 
        returns (bool[] memory results) 
    {
        results = new bool[](_documentHashes.length);
        
        for (uint256 i = 0; i < _documentHashes.length; i++) {
            (bool exists,,,) = trustLinkCore.verifyProof(_documentHashes[i]);
            results[i] = exists;
            
            if (exists) {
                emit ProofVerified(_documentHashes[i], msg.sender, block.timestamp);
            }
        }
        
        return results;
    }

    /**
     * @notice Get detailed proof information
     * @param _documentHash The document hash to lookup
     * @return exists Whether the proof exists
     * @return timestamp When the proof was recorded
     * @return agreementId The associated agreement ID
     * @return submittedBy Who submitted the proof
     * @return ageInSeconds How old the proof is in seconds
     */
    function getProofDetails(bytes32 _documentHash) 
        external 
        view 
        returns (
            bool exists,
            uint256 timestamp,
            uint256 agreementId,
            address submittedBy,
            uint256 ageInSeconds
        ) 
    {
        (bool proofExists, uint256 time, uint256 agId, address owner) = 
            trustLinkCore.verifyProof(_documentHash);
        
        uint256 age = proofExists ? block.timestamp - time : 0;
        
        return (proofExists, time, agId, owner, age);
    }

    /**
     * @notice Check if multiple proofs exist
     * @param _documentHashes Array of document hashes to check
     * @return Array of existence results
     */
    function checkProofsExist(bytes32[] calldata _documentHashes) 
        external 
        view 
        returns (bool[] memory) 
    {
        bool[] memory exists = new bool[](_documentHashes.length);
        
        for (uint256 i = 0; i < _documentHashes.length; i++) {
            (bool proofExists,,,) = trustLinkCore.verifyProof(_documentHashes[i]);
            exists[i] = proofExists;
        }
        
        return exists;
    }
}