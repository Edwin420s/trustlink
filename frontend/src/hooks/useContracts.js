import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { getTrustLinkContract, createAgreement, acceptAgreement, recordProof, verifyProof } from '../utils/contract'

export const useContracts = () => {
  const { account, provider, isConnected } = useWallet()
  const [contracts, setContracts] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize contracts when wallet connects
  useEffect(() => {
    if (isConnected && provider) {
      const coreAddress = import.meta.env.VITE_TRUSTLINK_CORE_ADDRESS
      
      if (coreAddress) {
        const coreContract = getTrustLinkContract(provider, coreAddress)
        setContracts({ core: coreContract })
      }
    }
  }, [isConnected, provider])

  const executeContractCall = useCallback(async (contractCall, successMessage) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await contractCall()
      
      if (successMessage) {
        // You can integrate with toast notifications here
        console.log(successMessage)
      }
      
      return result
    } catch (err) {
      const errorMessage = err.message || 'Contract call failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isConnected])

  const createNewAgreement = useCallback(async (partnerAddress) => {
    return executeContractCall(
      async () => {
        const signer = await provider.getSigner()
        return createAgreement(contracts.core, partnerAddress, signer)
      },
      'Agreement created successfully'
    )
  }, [executeContractCall, contracts.core, provider])

  const acceptExistingAgreement = useCallback(async (agreementId) => {
    return executeContractCall(
      async () => {
        const signer = await provider.getSigner()
        return acceptAgreement(contracts.core, agreementId, signer)
      },
      'Agreement accepted successfully'
    )
  }, [executeContractCall, contracts.core, provider])

  const recordDocumentProof = useCallback(async (agreementId, documentHash) => {
    return executeContractCall(
      async () => {
        const signer = await provider.getSigner()
        return recordProof(contracts.core, agreementId, documentHash, signer)
      },
      'Proof recorded successfully'
    )
  }, [executeContractCall, contracts.core, provider])

  const verifyDocumentProof = useCallback(async (documentHash) => {
    if (!contracts.core) {
      throw new Error('Contract not initialized')
    }

    return verifyProof(contracts.core, documentHash)
  }, [contracts.core])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    contracts,
    isLoading,
    error,
    createNewAgreement,
    acceptExistingAgreement,
    recordDocumentProof,
    verifyDocumentProof,
    clearError
  }
}