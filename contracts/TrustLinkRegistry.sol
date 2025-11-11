// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ITrustLinkCore.sol";

/**
 * @title TrustLinkRegistry
 * @dev Registry for managing proof visibility and public verification
 * @notice Allows users to control visibility of their proofs and enables public verification
 */
contract TrustLinkRegistry {
    ITrustLinkCore public trustLinkCore;
    
    mapping(bytes32 => bool) public isPublicProof;
    mapping(address => uint256) public userProofCount;
    mapping(address => bytes32[]) public userPublicProofs;
    mapping(address => mapping(bytes32 => bool)) private _userPublicSet;

    event ProofVisibilitySet(bytes32 indexed documentHash, bool isPublic, address setBy);
    event PublicProofAdded(bytes32 indexed documentHash, address owner);
    event PublicProofRemoved(bytes32 indexed documentHash, address owner);

    error ProofNotExists();
    error NotProofOwner();

    modifier proofExists(bytes32 _documentHash) {
        (bool exists,,,) = trustLinkCore.verifyProof(_documentHash);
        if (!exists) revert ProofNotExists();
        _;
    }

    modifier onlyProofOwner(bytes32 _documentHash) {
        (,,, address submittedBy) = trustLinkCore.verifyProof(_documentHash);
        if (msg.sender != submittedBy) revert NotProofOwner();
        _;
    }

    constructor(address _trustLinkCoreAddress) {
        trustLinkCore = ITrustLinkCore(_trustLinkCoreAddress);
    }

    /**
     * @notice Set proof visibility (public/private)
     * @param _documentHash The document hash to update
     * @param _isPublic Whether the proof should be publicly visible
     */
    function setProofVisibility(bytes32 _documentHash, bool _isPublic) 
        external 
        proofExists(_documentHash)
        onlyProofOwner(_documentHash)
    {
        isPublicProof[_documentHash] = _isPublic;
        
        if (_isPublic && !_userPublicSet[msg.sender][_documentHash]) {
            // Adding to public - only if not already in set
            _userPublicSet[msg.sender][_documentHash] = true;
            userProofCount[msg.sender]++;
            userPublicProofs[msg.sender].push(_documentHash);
            emit PublicProofAdded(_documentHash, msg.sender);
        } else if (!_isPublic && _userPublicSet[msg.sender][_documentHash]) {
            // Removing from public
            _userPublicSet[msg.sender][_documentHash] = false;
            if (userProofCount[msg.sender] > 0) {
                userProofCount[msg.sender]--;
            }
            emit PublicProofRemoved(_documentHash, msg.sender);
        }

        emit ProofVisibilitySet(_documentHash, _isPublic, msg.sender);
    }

    /**
     * @notice Verify a proof with public visibility check
     * @param _documentHash The document hash to verify
     * @return verified Whether the proof exists and is publicly visible
     * @return timestamp When the proof was recorded
     * @return agreementId The associated agreement ID
     * @return submittedBy Who submitted the proof
     */
    function verifyPublicProof(bytes32 _documentHash) 
        external 
        view 
        returns (bool verified, uint256 timestamp, uint256 agreementId, address submittedBy) 
    {
        (bool exists, uint256 time, uint256 agId, address owner) = 
            trustLinkCore.verifyProof(_documentHash);
        
        if (!exists || !isPublicProof[_documentHash]) {
            return (false, 0, 0, address(0));
        }
        
        return (true, time, agId, owner);
    }

    /**
     * @notice Get all public proofs for a user
     * @param _user The user's address
     * @return Array of public document hashes
     */
    function getUserPublicProofs(address _user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userPublicProofs[_user];
    }

    /**
     * @notice Get total public proof count for a user
     * @param _user The user's address
     * @return Number of public proofs
     */
    function getUserPublicProofCount(address _user) external view returns (uint256) {
        return userProofCount[_user];
    }

    /**
     * @notice Check if a proof is publicly visible
     * @param _documentHash The document hash to check
     * @return Whether the proof is publicly visible
     */
    function isProofPublic(bytes32 _documentHash) external view returns (bool) {
        return isPublicProof[_documentHash];
    }
}