import { useCallback, useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import WS_RPC from '@vite/vitejs-ws';
import { accountBlock, ViteAPI } from '@vite/vitejs';
import Landing from '../pages/Landing';
import AppHome from '../pages/AppHome';
import { connect } from '../utils/globalContext';
import { State, ViteBalanceInfo } from '../utils/types';
import Toast from './Toast';
import { VCSessionKey } from '../utils/viteConnect';
import { PROD } from '../utils/constants';
import PageContainer from './PageContainer';
import CafeContract from '../contracts/Cafe';
import History from '../pages/History';

const providerWsURLs = {
	...(PROD ? {} : { localnet: 'ws://localhost:23457' }),
	testnet: 'wss://buidl.vite.net/gvite/ws',
	mainnet: 'wss://node.vite.net/gvite/ws', // or 'wss://node-tokyo.vite.net/ws'
};
const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

type Props = State;

const Router = ({ setState, vcInstance, networkType }: Props) => {
	const connectedAccount = useMemo(() => vcInstance?.accounts[0], [vcInstance]);

	const rpc = useMemo(
		() =>
			new WS_RPC(
				networkType === 'mainnet' ? providerWsURLs.mainnet : providerWsURLs.testnet,
				providerTimeout,
				providerOptions
			),
		[networkType]
	);

	const viteApi = useMemo(() => {
		return new ViteAPI(rpc, () => {
			// console.log('client connected');
		});
	}, [rpc]);

	useEffect(() => setState({ viteApi }), [setState, viteApi]);

	const getBalanceInfo = useCallback(
		(address: string) => {
			return viteApi.getBalanceInfo(address);
		},
		[viteApi]
	);

	const subscribe = useCallback(
		(event: string, ...args: any) => {
			return viteApi.subscribe(event, ...args);
		},
		[viteApi]
	);

	const updateViteBalanceInfo = useCallback(() => {
		if (vcInstance?.accounts[0]) {
			getBalanceInfo(vcInstance.accounts[0])
				// @ts-ignore
				.then((res: ViteBalanceInfo) => {
					setState({ viteBalanceInfo: res });
				})
				.catch((e) => {
					console.log(e);
					setState({ toast: JSON.stringify(e), vcInstance: null });
					localStorage.removeItem(VCSessionKey);
					// Sometimes on page load, this will catch with
					// Error: CONNECTION ERROR: Couldn't connect to node wss://buidl.vite.net/gvite/ws.
				});
		}
	}, [setState, getBalanceInfo, vcInstance]);

	useEffect(updateViteBalanceInfo, [updateViteBalanceInfo]);

	useEffect(() => {
		if (vcInstance) {
			subscribe('newAccountBlocksByAddr', vcInstance.accounts[0])
				.then((event: any) => {
					event.on(() => {
						updateViteBalanceInfo();
					});
				})
				.catch((err: any) => console.warn(err));
		}
		return () => viteApi.unsubscribeAll();
	}, [setState, subscribe, vcInstance, viteApi, updateViteBalanceInfo]);

	const callContract = useCallback(
		(
			contract: typeof CafeContract,
			methodName: string,
			params: any[] = [],
			tokenId?: string,
			amount?: string
		) => {
			if (!vcInstance) {
				return;
			}
			const methodAbi = contract.abi.find(
				(x: any) => x.name === methodName && x.type === 'function'
			);
			if (!methodAbi) {
				throw new Error(`method not found: ${methodName}`);
			}
			const toAddress = contract.address[networkType];
			if (!toAddress) {
				throw new Error(`${networkType} contract address not found`);
			}
			const block = accountBlock.createAccountBlock('callContract', {
				address: connectedAccount,
				abi: methodAbi,
				toAddress,
				params,
				tokenId,
				amount,
			}).accountBlock;
			return vcInstance.signAndSendTx([{ block }]);
		},
		[connectedAccount, networkType, vcInstance]
	);
	useEffect(() => {
		setState({ callContract });
	}, [setState, callContract]);

	return (
		<BrowserRouter>
			<PageContainer>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/app" element={<AppHome />} />
					<Route path="/history" element={<History />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</PageContainer>
			<Toast />
		</BrowserRouter>
	);
};

export default connect(Router);
