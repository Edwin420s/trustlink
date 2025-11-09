import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useWallet } from './WalletContext'
import { useContracts } from '../hooks/useContracts'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext()

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_AGREEMENTS: 'SET_AGREEMENTS',
  ADD_AGREEMENT: 'ADD_AGREEMENT',
  UPDATE_AGREEMENT: 'UPDATE_AGREEMENT',
  SET_PROOFS: 'SET_PROOFS',
  ADD_PROOF: 'ADD_PROOF',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
}

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  agreements: [],
  proofs: [],
  recentActivity: []
}

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case ACTION_TYPES.SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.payload
      }
    
    case ACTION_TYPES.ADD_AGREEMENT:
      return {
        ...state,
        agreements: [action.payload, ...state.agreements]
      }
    
    case ACTION_TYPES.UPDATE_AGREEMENT:
      return {
        ...state,
        agreements: state.agreements.map(agreement =>
          agreement.id === action.payload.id
            ? { ...agreement, ...action.payload.updates }
            : agreement
        )
      }
    
    case ACTION_TYPES.SET_PROOFS:
      return {
        ...state,
        proofs: action.payload
      }
    
    case ACTION_TYPES.ADD_PROOF:
      return {
        ...state,
        proofs: [action.payload, ...state.proofs],
        recentActivity: [
          {
            type: 'proof_recorded',
            message: `Proof recorded for Agreement #${action.payload.agreementId}`,
            timestamp: Date.now()
          },
          ...state.recentActivity.slice(0, 9) // Keep only last 10 items
        ]
      }
    
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    case ACTION_TYPES.RESET_STATE:
      return initialState
    
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { isConnected, account } = useWallet()
  const { contracts, isLoading: contractsLoading } = useContracts()
  const [userPreferences, setUserPreferences] = useLocalStorage('trustlink_preferences', {
    theme: 'light',
    notifications: true
  })

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      dispatch({ type: ACTION_TYPES.RESET_STATE })
    }
  }, [isConnected])

  // Load agreements when connected
  useEffect(() => {
    if (isConnected && contracts.core && account) {
      loadAgreements()
    }
  }, [isConnected, contracts.core, account])

  const loadAgreements = async () => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true })
    
    try {
      // In a real app, fetch from contract
      // const agreementIds = await contracts.core.getUserAgreements(account)
      // const agreements = await Promise.all(agreementIds.map(id => contracts.core.agreements(id)))
      
      // Mock data for demo
      const mockAgreements = [
        {
          id: 1,
          initiator: account,
          partner: '0x7421d123456789abcdef123456789abcdef12345',
          isActive: true,
          createdAt: Math.floor(Date.now() / 1000) - 86400
        }
      ]
      
      dispatch({ type: ACTION_TYPES.SET_AGREEMENTS, payload: mockAgreements })
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message })
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false })
    }
  }

  const addAgreement = (agreement) => {
    dispatch({ type: ACTION_TYPES.ADD_AGREEMENT, payload: agreement })
  }

  const updateAgreement = (agreementId, updates) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_AGREEMENT,
      payload: { id: agreementId, updates }
    })
  }

  const addProof = (proof) => {
    dispatch({ type: ACTION_TYPES.ADD_PROOF, payload: proof })
  }

  const setLoading = (loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading })
  }

  const setError = (error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error })
  }

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR })
  }

  const updatePreferences = (newPreferences) => {
    setUserPreferences(newPreferences)
  }

  const value = {
    ...state,
    userPreferences,
    addAgreement,
    updateAgreement,
    addProof,
    setLoading,
    setError,
    clearError,
    updatePreferences,
    reloadAgreements: loadAgreements
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}