// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ITrustLinkCore.sol";

/**
 * @title TrustLinkCore
 * @dev Core contract for managing digital agreements and document proofs
 * @notice Enables parties to create mutual agreements and record verifiable document proofs
 */
contract TrustLinkCore is ITrustLinkCore {
    uint256 private _agreementCounter;
    
    mapping(uint256 => Agreement) public agreements;
    mapping(bytes32 => Proof) public proofs;
    mapping(address => uint256[]) private _userAgreements;
    mapping(uint256 => bool) private _agreementExists;

    event AgreementCreated(uint256 indexed id, address indexed initiator, address indexed partner);
    event AgreementAccepted(uint256 indexed id, address partner);
    event AgreementCancelled(uint256 indexed id, address cancelledBy);
    event ProofRecorded(uint256 indexed agreementId, bytes32 indexed documentHash, address indexed submittedBy);
    event ProofAcknowledged(bytes32 indexed documentHash, address acknowledgedBy);
    event ProofRevocationProposed(bytes32 indexed documentHash, address proposedBy);
    event ProofRevoked(bytes32 indexed documentHash, address revokedBy);

    error InvalidAddress();
    error AgreementNotExists();
    error AgreementAlreadyActive();
    error NotAuthorized();
    error ProofAlreadyExists();
    error InvalidAgreement();
    error ProofNotExists();
    error ProofAlreadyAcknowledged();
    error ProofAlreadyRevoked();
    error CannotAcknowledgeOwnProof();

    modifier validAddress(address _address) {
        if (_address == address(0)) revert InvalidAddress();
        _;
    }

    modifier agreementExists(uint256 _agreementId) {
        if (!_agreementExists[_agreementId]) revert AgreementNotExists();
        _;
    }

    modifier onlyParticipant(uint256 _agreementId) {
        Agreement memory ag = agreements[_agreementId];
        if (msg.sender != ag.initiator && msg.sender != ag.partner) {
            revert NotAuthorized();
        }
        _;
    }

    /**
     * @notice Create a new agreement with another user
     * @param _partner The address of the partner to create agreement with
     * @return agreementId The ID of the newly created agreement
     */
    function createAgreement(address _partner) 
        external 
        override 
        validAddress(_partner) 
        returns (uint256) 
    {
        if (_partner == msg.sender) revert InvalidAddress();
        
        _agreementCounter++;
        uint256 newAgreementId = _agreementCounter;

        agreements[newAgreementId] = Agreement({
            id: newAgreementId,
            initiator: msg.sender,
            partner: _partner,
            isActive: false,
            createdAt: block.timestamp
        });

        _agreementExists[newAgreementId] = true;
        _userAgreements[msg.sender].push(newAgreementId);

        emit AgreementCreated(newAgreementId, msg.sender, _partner);
        
        return newAgreementId;
    }

    /**
     * @notice Accept a pending agreement
     * @param _agreementId The ID of the agreement to accept
     */
    function acceptAgreement(uint256 _agreementId) 
        external 
        override 
        agreementExists(_agreementId) 
    {
        Agreement storage agreement = agreements[_agreementId];
        
        if (msg.sender != agreement.partner) revert NotAuthorized();
        if (agreement.isActive) revert AgreementAlreadyActive();

        agreement.isActive = true;
        _userAgreements[msg.sender].push(_agreementId);

        emit AgreementAccepted(_agreementId, msg.sender);
    }

    /**
     * @notice Cancel an agreement (only participants can cancel)
     * @param _agreementId The ID of the agreement to cancel
     */
    function cancelAgreement(uint256 _agreementId) 
        external 
        agreementExists(_agreementId)
        onlyParticipant(_agreementId)
    {
        Agreement storage agreement = agreements[_agreementId];
        agreement.isActive = false;

        emit AgreementCancelled(_agreementId, msg.sender);
    }

    /**
     * @notice Record a document proof under an active agreement
     * @param _agreementId The agreement ID to record proof under
     * @param _documentHash The SHA-256 hash of the document
     */
    function recordProof(uint256 _agreementId, bytes32 _documentHash) 
        external 
        override 
        agreementExists(_agreementId)
        onlyParticipant(_agreementId)
    {
        Agreement memory agreement = agreements[_agreementId];
        
        if (!agreement.isActive) revert InvalidAgreement();
        if (proofs[_documentHash].timestamp != 0) revert ProofAlreadyExists();

        proofs[_documentHash] = Proof({
            agreementId: _agreementId,
            documentHash: _documentHash,
            timestamp: block.timestamp,
            submittedBy: msg.sender
        });

        emit ProofRecorded(_agreementId, _documentHash, msg.sender);
    }

    /**
     * @notice Verify if a document proof exists and return its details
     * @param _documentHash The SHA-256 hash to verify
     * @return exists Whether the proof exists
     * @return timestamp When the proof was recorded
     * @return agreementId The agreement ID the proof is linked to
     * @return submittedBy Who submitted the proof
     */
    function verifyProof(bytes32 _documentHash) 
        external 
        view 
        override 
        returns (bool exists, uint256 timestamp, uint256 agreementId, address submittedBy) 
    {
        Proof memory proof = proofs[_documentHash];
        
        if (proof.timestamp == 0) {
            return (false, 0, 0, address(0));
        }
        
        return (true, proof.timestamp, proof.agreementId, proof.submittedBy);
    }

    /**
     * @notice Get all agreement IDs for a user
     * @param _user The user's address
     * @return Array of agreement IDs
     */
    function getUserAgreements(address _user) 
        external 
        view 
        override 
        returns (uint256[] memory) 
    {
        return _userAgreements[_user];
    }

    /**
     * @notice Check if an agreement is active
     * @param _agreementId The agreement ID to check
     * @return Whether the agreement is active
     */
    function isAgreementActive(uint256 _agreementId) external view returns (bool) {
        if (!_agreementExists[_agreementId]) return false;
        return agreements[_agreementId].isActive;
    }

    /**
     * @notice Get agreement details
     * @param _agreementId The agreement ID
     * @return Agreement details
     */
    function getAgreement(uint256 _agreementId) 
        external 
        view 
        returns (Agreement memory) 
    {
        if (!_agreementExists[_agreementId]) revert AgreementNotExists();
        return agreements[_agreementId];
    }

    /**
     * @notice Get total agreement count
     * @return The total number of agreements created
     */
    function getTotalAgreements() external view returns (uint256) {
        return _agreementCounter;
    }
}