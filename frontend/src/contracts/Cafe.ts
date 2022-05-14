const Cafe = {
	address: {
		mainnet: '',
		testnet: 'vite_40a7f24b11036aaa293a0a9751f66c1d88e7a6a13e9d0cb629', // <your_contract_address>
		localnet: '',
	},
	abi: [
		{ inputs: [], stateMutability: 'payable', type: 'constructor' },
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'from',
					type: 'address',
				},
				{
					indexed: false,
					internalType: 'address',
					name: 'to',
					type: 'address',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: 'num',
					type: 'uint256',
				},
			],
			name: 'Buy',
			type: 'event',
		},
		{
			inputs: [],
			name: 'VITE',
			outputs: [{ internalType: 'tokenId', name: '', type: 'tokenId' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address payable', name: 'to', type: 'address' },
				{ internalType: 'uint256', name: 'numOfCups', type: 'uint256' },
			],
			name: 'buyCoffee',
			outputs: [],
			stateMutability: 'payable',
			type: 'function',
		},
		{
			inputs: [],
			name: 'price',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{ stateMutability: 'payable', type: 'receive' },
	],
};

export default Cafe;
