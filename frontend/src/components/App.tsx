import '../styles/reset.css';
import '../styles/colors.css';
import '../styles/classes.css';
import '../styles/theme.ts';
import Router from './Router';
import { Provider } from '../utils/globalContext';
import { useEffect, useState } from 'react';
import { getValidVCSession, initVC } from '../utils/viteConnect';
import { State } from '../utils/types';

const App = () => {
	const [initialState, initialStateSet] = useState<object>();

	useEffect(() => {
		(async () => {
			const state: Pick<State, 'networkType' | 'languageType' | 'vcInstance'> =
				{
					networkType: localStorage.networkType || 'Testnet',
					languageType: localStorage.languageType || 'en',
					vcInstance: getValidVCSession() ? initVC() : null,
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
