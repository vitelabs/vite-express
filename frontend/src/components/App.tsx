import '../styles/reset.css';
import '../styles/colors.css';
import '../styles/classes.css';
import '../styles/theme.ts';
import Router from '../containers/Router';
import { Provider } from '../utils/globalContext';
import { useEffect, useState } from 'react';
import { getValidVCSession, initViteConnect } from '../utils/viteConnect';
import { State } from '../utils/types';

const App = () => {
	const [initialState, initialStateSet] = useState<object>();
	useEffect(() => {
		(async () => {
			const vcSession = getValidVCSession();
			const vcInstance = vcSession ? initViteConnect(vcSession) : undefined;
			let vpAddress = window.vitePassport && (await window.vitePassport.getConnectedAddress());
			const state: Partial<State> = {
				vcInstance,
				vpAddress,
				networkType: localStorage.networkType || 'testnet',
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
