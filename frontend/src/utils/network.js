export const NETWORKS = {
  lineaTestnet: {
    chainId: '0xe704',
    chainName: 'Linea Testnet',
    rpcUrl: 'https://rpc.linea.build',
    blockExplorer: 'https://explorer.linea.build',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  // Add other networks as needed
}

export const getNetworkConfig = (networkName) => {
  return NETWORKS[networkName] || NETWORKS.lineaTestnet
}

export const switchNetwork = async (networkName) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed')
  }

  const networkConfig = getNetworkConfig(networkName)
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: networkConfig.chainId,
              chainName: networkConfig.chainName,
              rpcUrls: [networkConfig.rpcUrl],
              blockExplorerUrls: [networkConfig.blockExplorer],
              nativeCurrency: networkConfig.nativeCurrency,
            },
          ],
        })
      } catch (addError) {
        throw new Error(`Failed to add network: ${addError.message}`)
      }
    } else {
      throw new Error(`Failed to switch network: ${switchError.message}`)
    }
  }
}

export const isSupportedNetwork = (chainId) => {
  const supportedChainIds = Object.values(NETWORKS).map(network => network.chainId)
  return supportedChainIds.includes(chainId)
}