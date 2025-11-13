import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Users, CheckCircle, Clock } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { getTrustLinkContract } from '../utils/contract'
import { CONTRACT_ADDRESSES } from '../utils/constants'

const Dashboard = () => {
  const { account, isConnected, provider } = useWallet()
  const [stats, setStats] = useState({
    activeAgreements: 0,
    proofsRecorded: 0,
    pendingRequests: 0
  })
  const [activity, setActivity] = useState([])

  useEffect(() => {
    let unsub = () => {}
    const run = async () => {
      if (!isConnected || !account || !CONTRACT_ADDRESSES.trustLinkCore) return
      let browserProvider = provider
      if (!browserProvider && typeof window !== 'undefined' && window.ethereum) {
        const { ethers } = await import('ethers')
        browserProvider = new ethers.BrowserProvider(window.ethereum)
      }
      if (!browserProvider) return
      const contract = getTrustLinkContract(browserProvider, CONTRACT_ADDRESSES.trustLinkCore)
      try {
        const ids = await contract.getUserAgreements(account)
        let active = 0
        for (const id of ids) {
          const ag = await contract.getAgreement(id)
          if (ag.isActive) active += 1
        }
        setStats(s => ({ ...s, activeAgreements: Number(active) }))
      } catch {}
      try {
        const filter = contract.filters.ProofRecorded(null, null, account)
        const logs = await contract.queryFilter(filter, 0, 'latest')
        setStats(s => ({ ...s, proofsRecorded: logs.length }))
      } catch {}
      setStats(s => ({ ...s, pendingRequests: 0 }))
      const onProof = (agreementId, documentHash, submittedBy) => {
        setActivity(a => [{
          type: 'proof',
          title: `Proof recorded for Agreement #${Number(agreementId)}`,
          icon: 'proof',
          ts: Date.now()
        }, ...a].slice(0, 20))
        setStats(s => ({ ...s, proofsRecorded: s.proofsRecorded + (submittedBy?.toLowerCase?.() === account.toLowerCase() ? 1 : 0) }))
      }
      const onAgreementCreated = (id, initiator, partner) => {
        if (initiator?.toLowerCase?.() === account.toLowerCase() || partner?.toLowerCase?.() === account.toLowerCase()) {
          setActivity(a => [{
            type: 'agreement',
            title: `Agreement #${Number(id)} created`,
            icon: 'agreement',
            ts: Date.now()
          }, ...a].slice(0, 20))
        }
      }
      const onAgreementAccepted = (id, partner) => {
        setActivity(a => [{
          type: 'accepted',
          title: `Agreement #${Number(id)} accepted`,
          icon: 'accepted',
          ts: Date.now()
        }, ...a].slice(0, 20))
        setStats(s => ({ ...s, activeAgreements: s.activeAgreements + 1 }))
      }
      contract.on('ProofRecorded', onProof)
      contract.on('AgreementCreated', onAgreementCreated)
      contract.on('AgreementAccepted', onAgreementAccepted)
      unsub = () => {
        contract.off('ProofRecorded', onProof)
        contract.off('AgreementCreated', onAgreementCreated)
        contract.off('AgreementAccepted', onAgreementAccepted)
      }
    }
    run()
    return () => unsub()
  }, [isConnected, account, provider])

  const quickActions = [
    {
      title: 'Create Agreement',
      description: 'Start a new trust agreement',
      icon: Users,
      link: '/agreements',
      buttonText: 'Get Started'
    },
    {
      title: 'Record Proof',
      description: 'Add a document to an existing agreement',
      icon: FileText,
      link: '/record-proof',
      buttonText: 'Record Now'
    },
    {
      title: 'Verify Document',
      description: 'Check if a document has been verified',
      icon: CheckCircle,
      link: '/verify',
      buttonText: 'Verify'
    }
  ]

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-primary-600 mb-6">
            Please connect your wallet to access the TrustLink dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">
          Welcome back
        </h1>
        <p className="text-primary-600">
          Here's what's happening with your trust agreements today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">
                {stats.activeAgreements}
              </p>
              <p className="text-primary-500 text-sm">Active Agreements</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">
                {stats.proofsRecorded}
              </p>
              <p className="text-primary-500 text-sm">Proofs Recorded</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">
                {stats.pendingRequests}
              </p>
              <p className="text-primary-500 text-sm">Pending Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div key={index} className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-50 p-2 rounded-lg">
                  <action.icon className="h-6 w-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-primary-700">
                  {action.title}
                </h3>
              </div>
              <p className="text-primary-600 text-sm mb-4">
                {action.description}
              </p>
              <Link to={action.link} className="btn-primary w-full text-center">
                {action.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          Recent Activity
        </h3>
        {activity.length === 0 ? (
          <div className="text-primary-500 text-sm">No activity yet.</div>
        ) : (
          <div className="space-y-3">
            {activity.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-primary-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  {item.icon === 'proof' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : item.icon === 'agreement' ? (
                    <Users className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary-500" />
                  )}
                  <span className="text-primary-700">{item.title}</span>
                </div>
                <span className="text-sm text-primary-500">just now</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard