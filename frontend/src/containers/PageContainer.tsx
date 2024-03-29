import { ReactNode, useEffect, useState } from 'react';
import { TranslateIcon, SunIcon, MoonIcon, DesktopComputerIcon } from '@heroicons/react/outline';
import A from '../components/A';
import { State } from '../utils/types';
import { prefersDarkTheme } from '../utils/misc';
import { connect } from '../utils/globalContext';
import ConnectWalletButton from './ConnectWalletButton';
import ViteLogo from '../assets/ViteLogo';
import { networkList } from '../utils/constants';
import DropdownButton from '../components/DropdownButton';

type Props = State & {
	noPadding?: boolean;
	children: ReactNode;
};

const PageContainer = ({
	noPadding,
	activeNetworkIndex,
	languageType,
	i18n,
	setState,
	children,
	vpAddress,
	activeAddress,
}: Props) => {
	const [theme, themeSet] = useState(localStorage.theme);

	useEffect(() => {
		import(`../i18n/${languageType}.ts`).then((translation) => {
			setState({ i18n: translation.default });
		});
	}, [setState, languageType]);

	const languages = [
		['English', 'en'],
		// ['English', 'en'],
	];

	const themes: [typeof SunIcon, string][] = [
		[SunIcon, i18n?.light],
		[MoonIcon, i18n?.dark],
		[DesktopComputerIcon, i18n?.system],
	];

	useEffect(() => {
		let unsubscribe = () => {};
		if (window?.vitePassport && vpAddress && vpAddress === activeAddress) {
			unsubscribe = window.vitePassport.on('networkChange', (payload) => {
				let activeNetworkIndex = networkList.findIndex(
					(n) => n.rpcUrl === payload.activeNetwork.rpcUrl
				);
				if (activeNetworkIndex === -1) {
					setState({ toast: i18n.vitePassportNetworkDoesNotMatchDappNetworkUrl });
					activeNetworkIndex = 0;
				}
				setState({ activeNetworkIndex });
			});
		}
		return unsubscribe;
	}, [setState, vpAddress, activeAddress, i18n]);

	useEffect(() => {
		let unsubscribe = () => {};
		if (window?.vitePassport) {
			unsubscribe = window.vitePassport.on('accountChange', (payload) => {
				setState({ vpAddress: payload.activeAddress });
			});
		}
		return unsubscribe;
	}, [setState]);

	return !i18n ? null : (
		<div className="h-0 min-h-screen relative flex flex-col">
			<header className="fx px-2 h-12 justify-between top-[1px] w-full fixed z-50">
				<div className="fx gap-3">
					<A to="/" className="px-1 h-8">
						<ViteLogo className="text-skin-base h-7" />
					</A>
					<A to="/app" className="text-skin-secondary">
						{i18n.app}
					</A>
					<A to="/history" className="text-skin-secondary">
						{i18n.history}
					</A>
				</div>
				<div className="fx gap-3 relative">
					<DropdownButton
						buttonJsx={
							<p className="text-skin-secondary">{networkList[activeNetworkIndex].name}</p>
						}
						dropdownJsx={
							<>
								{networkList.map((network, i) => {
									return (
										<button
											key={network.rpcUrl}
											className={`fx font-semibold px-2 w-full h-7 bg-skin-foreground brightness-button ${
												activeNetworkIndex === i ? 'text-skin-highlight' : ''
											}`}
											onMouseDown={(e) => e.preventDefault()}
											onClick={() => {
												localStorage.activeNetworkIndex = i;
												setState({ activeNetworkIndex: i });
											}}
										>
											{network.name}
										</button>
									);
								})}
							</>
						}
					/>
					<ConnectWalletButton />
					<DropdownButton
						buttonJsx={
							<div className="w-8 h-8 xy">
								<TranslateIcon className="text-skin-muted w-7 h-7" />
							</div>
						}
						dropdownJsx={
							<>
								{languages.map(([language, shorthand]) => {
									const active =
										localStorage.languageType === shorthand ||
										(!localStorage.languageType && shorthand === 'en');
									return (
										<button
											key={language}
											className={`fx px-2 w-full h-7 bg-skin-foreground brightness-button ${
												active ? 'text-skin-highlight' : ''
											}`}
											onMouseDown={(e) => e.preventDefault()}
											onClick={() => {
												localStorage.languageType = shorthand;
												setState({ languageType: shorthand });
											}}
										>
											{language}
										</button>
									);
								})}
							</>
						}
					/>
					<DropdownButton
						buttonJsx={
							<div className="w-8 h-8 xy">
								<div
									className={`w-7 h-7 ${
										theme === 'system' ? 'text-skin-muted' : 'text-skin-highlight'
									}`}
								>
									<SunIcon className="block dark:hidden" />
									<MoonIcon className="hidden dark:block" />
								</div>
							</div>
						}
						dropdownJsx={
							<>
								{themes.map(([Icon, label]) => {
									const active = localStorage.theme === label;
									return (
										<button
											key={label}
											className="fx px-2 py-0.5 h-7 gap-2 w-full bg-skin-foreground brightness-button"
											onMouseDown={(e) => e.preventDefault()}
											onClick={() => {
												localStorage.theme = label;
												themeSet(label);
												if (label === 'light' || !prefersDarkTheme()) {
													document.documentElement.classList.remove('dark');
												} else if (label === 'dark' || prefersDarkTheme()) {
													document.documentElement.classList.add('dark');
												}
											}}
										>
											<Icon
												className={`h-full ${
													active ? 'text-skin-highlight' : 'text-skin-secondary'
												}`}
											/>
											<p className={`font-semibold ${active ? 'text-skin-highlight' : ''}`}>
												{label[0].toUpperCase() + label.substring(1)}
											</p>
										</button>
									);
								})}
							</>
						}
					/>
				</div>
			</header>
			<main className={`flex-1 ${noPadding ? '' : 'px-4 pt-14'}`}>{children}</main>
			<div className="fx justify-end gap-2 mx-4 my-3 text-skin-muted text-sm">
				<A href="https://twitter.com/vitelabs" className="brightness-button">
					Twitter
				</A>
				<A href="https://github.com/vitelabs/vite-express" className="brightness-button">
					GitHub
				</A>
				<A href="https://discord.gg/AEnScAQA" className="brightness-button">
					Discord
				</A>
			</div>
		</div>
	);
};

export default connect(PageContainer);
