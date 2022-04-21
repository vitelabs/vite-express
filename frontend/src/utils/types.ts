import { ViteAPI } from '@vite/vitejs/distSrc/viteAPI/type';
import ExampleContract from '../contracts/ExampleContract';
import { setStateType } from './globalContext';
import { VC } from './viteConnect';

export type NetworkTypes = 'Testnet' | 'Mainnet' | 'Localnet';

export type State = {
	setState: setStateType;
	callContract: (
		contract: typeof ExampleContract,
		methodName: string,
		params?: any[],
		tokenId?: string,
		amount?: string
	) => Promise<object>;
	viteApi: ViteAPI;
	toast: string;
	languageType: string;
	networkType: NetworkTypes;
	i18n: { [key: string]: string };
	vcInstance: VC | null;
	metamaskAddress: string;
	viteBalanceInfo: ViteBalanceInfo;
};

export type ViteBalanceInfo = {
	balance: {
		address: string;
		blockCount: string;
		balanceInfoMap?: {
			[tokenId: string]: {
				tokenInfo: TokenInfo;
				balance: string;
			};
		};
	};
	unreceived: {
		address: string;
		blockCount: string;
	};
};

export type TokenInfo = {
	tokenName: string;
	tokenSymbol: string;
	totalSupply: string;
	decimals: number;
	owner: string;
	tokenId: string;
	maxSupply: string;
	ownerBurnOnly: false;
	isReIssuable: false;
	index: number;
	isOwnerBurnOnly: false;
};

export type NewAccountBlock = {
	hash: string;
	height: number;
	heightStr: string;
	removed: boolean;
};
