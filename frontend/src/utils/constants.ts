export const PROD = process.env.NODE_ENV === 'production';

export const networkList = [
	{
		name: 'Mainnet',
		rpcUrl: 'wss://node.vite.net/gvite/ws',
		explorerUrl: 'https://vitescan.io',
	},
	{
		name: 'Testnet',
		rpcUrl: 'wss://buidl.vite.net/gvite/ws',
		explorerUrl: 'https://test.vitescan.io',
	},
	{
		name: 'Localnet',
		rpcUrl: 'ws://localhost:23457',
	},
];
