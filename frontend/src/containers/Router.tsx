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
import { copyToClipboardAsync } from '../utils/strings';

const providerWsURLs = {
	...(PROD ? {} : { localnet: 'ws://localhost:23457' }),
	testnet: 'wss://buidl.vite.net/gvite/ws',
	mainnet: 'wss://node.vite.net/gvite/ws', // or 'wss://node-tokyo.vite.net/ws'
};
const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

type Props = State;

const Router = ({ i18n, setState, vpAddress, vcInstance, networkType }: Props) => {
	const activeAddress = useMemo(() => {
		return vpAddress || vcInstance?.accounts[0];
	}, [vpAddress, vcInstance]);
	useEffect(() => {
		setState({ activeAddress });
	}, [setState, activeAddress]);

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
					setState({ toast: e, vcInstance: undefined });
					localStorage.removeItem(VCSessionKey);
					// Sometimes on page load, this will catch with
					// Error: CONNECTION ERROR: Couldn't connect to node wss://buidl.vite.net/gvite/ws.
				});
		}
	}, [setState, getBalanceInfo, vcInstance]);

	useEffect(updateViteBalanceInfo, [updateViteBalanceInfo]);

	// useEffect(() => {
	// 	if (window.vitePassport) {
	// 		window.vitePassport
	// 			.getConnectedAddress()
	// 			.then((data) => {
	// 				console.log('data', data);
	// 			})
	// 			.catch((err) => {
	// 				console.log('err', err);
	// 			});
	// 	}
	// }, []);

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
		async (
			contract: typeof CafeContract,
			methodName: string,
			params: any[] = [],
			tokenId?: string,
			amount?: string
		) => {
			if (!activeAddress) {
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
				const toast = `${networkType} contract address not found`;
				setState({ toast });
				throw new Error(toast);
			}
			const blockParams = {
				address: activeAddress,
				abi: methodAbi,
				toAddress,
				params,
				tokenId,
				amount,
			};
			if (vpAddress === activeAddress) {
				return window.vitePassport.writeAccountBlock('callContract', blockParams);
			} else if (vcInstance) {
				return vcInstance.signAndSendTx([
					{ block: accountBlock.createAccountBlock('callContract', blockParams).accountBlock },
				]);
			}
		},
		[activeAddress, networkType, vcInstance, setState, vpAddress]
	);

	useEffect(() => {
		setState({ callContract });
	}, [setState, callContract]);

	useEffect(() => {
		setState({
			copyWithToast: (text = '') => {
				if (copyToClipboardAsync(text)) {
					setState({ toast: i18n.successfullyCopied });
				} else {
					setState({ toast: 'clipboard API not supported' });
				}
			},
		});
	}, [setState, i18n]);

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
