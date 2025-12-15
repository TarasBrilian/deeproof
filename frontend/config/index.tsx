import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const mantleSepolia = defineChain({
    id: 5003,
    name: 'Mantle Sepolia',
    chainNamespace: 'eip155',
    caipNetworkId: 'eip155:5003',
    nativeCurrency: {
        decimals: 18,
        name: 'MNT',
        symbol: 'MNT',
    },
    rpcUrls: {
        default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Etherscan', url: 'https://explorer.sepolia.mantle.xyz' },
    },
})

export const networks = [sepolia, mantleSepolia] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig
