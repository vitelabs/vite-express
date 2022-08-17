import { AccountBlockBlock } from '@vite/vitejs/distSrc/utils/type';
import { ViteAPI } from '@vite/vitejs/distSrc/viteAPI/type';
import CafeContract from '../contracts/Cafe';
import en from '../i18n/en';
import { setStateType } from './globalContext';
import { VC } from './viteConnect';

type Network = {
	name: string;
	rpcUrl: string;
	explorerUrl?: string;
};
type injectedScriptEvents = 'accountChange' | 'networkChange';
type VitePassport = {
	getConnectedAddress: () => Promise<undefined | string>;
	disconnectWallet: () => Promise<undefined>;
	getNetwork: () => Promise<Network>;
	connectWallet: () => Promise<{ domain: string }>;
	writeAccountBlock: (type: string, params: object) => Promise<AccountBlockBlock>;
	on: (
		event: injectedScriptEvents,
		callback: (payload: { activeAddress?: string; activeNetwork: Network }) => void
	) => () => void;
};
declare global {
	interface Window {
		vitePassport?: VitePassport;
	}
}

export type State = {
	setState: setStateType;
	callContract: (
		contract: typeof CafeContract,
		methodName: string,
		params?: any[],
		tokenId?: string,
		amount?: string
	) => Promise<object>;
	scanEvents: (
		abi: any[],
		address: string,
		fromHeight: string,
		eventName: string
	) => Promise<object>;
	viteApi: ViteAPI;
	toast: any;
	languageType: string;
	activeNetworkIndex: number;
	i18n: typeof en;
	vcInstance?: VC;
	vpAddress?: string;
	activeAddress?: string;
	viteBalanceInfo: ViteBalanceInfo;
	copyWithToast: (text: string) => void;
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

export type CoffeeBuyEvent = {
	returnValues: {
		from: string;
		to: string;
		num: string;
	};
	event: string;
	raw: {
		data: string;
		topics: [string];
	};
	signature: string;
	accountBlockHeight: string;
	accountBlockHash: string;
	address: string;
};
