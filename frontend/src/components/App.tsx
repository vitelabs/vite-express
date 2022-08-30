import '../styles/reset.css';
import '../styles/colors.css';
import '../styles/classes.css';
import '../styles/theme.ts';
import Router from '../containers/Router';
import { Provider } from '../utils/globalContext';
import { useEffect, useState } from 'react';
import { getValidVCSession, initViteConnect } from '../utils/viteConnect';
import { State } from '../utils/types';
import { networkList } from '../utils/constants';

const App = () => {
	const [initialState, initialStateSet] = useState<object>();
	useEffect(() => {
		(async () => {
			const vcSession = getValidVCSession();
			const vcInstance = vcSession ? initViteConnect(vcSession) : undefined;
			let vpAddress: undefined | string;
			let activeNetworkIndex: undefined | number;

			if (window?.vitePassport?.getConnectedAddress) {
				vpAddress = await window.vitePassport.getConnectedAddress();
				if (vpAddress) {
					const activeNetwork = await window.vitePassport.getNetwork();
					activeNetworkIndex = networkList.findIndex((n) => n.rpcUrl === activeNetwork.rpcUrl);
				}
			}
			if (activeNetworkIndex === undefined || activeNetworkIndex === -1) {
				activeNetworkIndex = 0;
			}

			// console.log('vpAddress:', vpAddress);
			const state: Partial<State> = {
				vcInstance,
				vpAddress,
				activeNetworkIndex,
				languageType: localStorage.languageType || 'en',
				activeAddress: vpAddress || vcInstance?.accounts?.[0],
			};
			initialStateSet(state);
		})();
	}, []);

	return initialState ? (
		<Provider initialState={initialState}>
			<Router />
		</Provider>
	) : null;
};

export default App;
