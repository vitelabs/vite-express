import { ReactNode, useEffect, useRef, useState } from 'react';
import {
	TranslateIcon,
	SunIcon,
	MoonIcon,
	DesktopComputerIcon,
	LogoutIcon,
} from '@heroicons/react/outline';
import A from './A';
import { NetworkTypes, State } from '../utils/types';
import { useKeyPress } from '../utils/hooks';
import { prefersDarkTheme } from '../utils/misc';
import { connect } from '../utils/globalContext';
import ConnectWalletButton from '../containers/ConnectWalletButton';
import ViteLogo from '../assets/ViteLogo';
import { shortenAddress } from '../utils/strings';
import { PROD } from '../utils/constants';

type Props = State & {
	noPadding?: boolean;
	children: ReactNode;
};

const DropdownButton = ({
	buttonJsx,
	dropdownJsx,
}: {
	buttonJsx: ReactNode;
	dropdownJsx: ReactNode;
}) => {
	const [open, openSet] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useKeyPress('Escape', () => {
		if (buttonRef.current) {
			buttonRef.current.blur();
			openSet(false);
		}
	});

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				onClick={() => openSet(!open)}
				tabIndex={0}
				className="h-8 xy brightness-button"
				onBlur={() => openSet(false)}
			>
				{buttonJsx}
			</button>
			{open && (
				<div className="rounded-md shadow-md absolute py-0.5 overflow-hidden top-10 right-0 bg-skin-foreground">
					{dropdownJsx}
				</div>
			)}
		</div>
	);
};

const PageContainer = ({
	noPadding,
	networkType,
	languageType,
	i18n,
	vcInstance,
	setState,
	children,
}: Props) => {
	const [theme, themeSet] = useState(localStorage.theme);

	useEffect(() => {
		if (!i18n) {
			import(`../i18n/${languageType}.json`).then((translation) => {
				// https://stackoverflow.com/a/67615605/13442719
				setState({ i18n: { ...translation } });
			});
		}
	}, [setState, i18n, languageType]);

	const networkTypes: NetworkTypes[] = [
		'Testnet',
		'Mainnet',
		...(PROD ? [] : ['Localnet' as NetworkTypes]),
	];

	const languages = [
		['English', 'en'],
		// ['English', 'en'],
	];

	const themes: [typeof SunIcon, string][] = [
		[SunIcon, i18n?.light],
		[MoonIcon, i18n?.dark],
		[DesktopComputerIcon, i18n?.system],
	];

	return !i18n ? null : (
		<div className="h-0 min-h-screen relative flex flex-col">
			<header className="fx px-2 h-12 justify-between top-[1px] w-full fixed z-50">
				<A to="/" className="px-1 h-8">
					<ViteLogo className="text-skin-base h-7" />
				</A>
				<div className="fx gap-3 relative">
					<DropdownButton
						buttonJsx={<p className="text-skin-secondary">{networkType}</p>}
						dropdownJsx={
							<>
								{networkTypes.map((network) => {
									const active = localStorage.networkType === network;
									return (
										<button
											key={network}
											className={`fx font-semibold px-2 w-full h-7 bg-skin-foreground brightness-button ${
												active ? 'text-skin-highlight' : ''
											}`}
											onMouseDown={(e) => e.preventDefault()}
											onClick={() => {
												localStorage.networkType = network;
												setState({ networkType: network });
											}}
										>
											{network}
										</button>
									);
								})}
							</>
						}
					/>
					{vcInstance ? (
						<DropdownButton
							buttonJsx={<p>{shortenAddress(vcInstance.accounts[0])}</p>}
							dropdownJsx={
								<div className="fx px-2 py-0.5 h-7 gap-2">
									<LogoutIcon className="h-full text-skin-muted" />
									<button
										className="font-semibold"
										onClick={() => {
											vcInstance.killSession();
											setState({ vcInstance: null });
										}}
										onMouseDown={(e) => e.preventDefault()}
									>
										{i18n.logOut}
									</button>
								</div>
							}
						/>
					) : (
						<ConnectWalletButton className="bg-skin-medlight h-8 px-3 rounded-md brightness-button font-semibold text-white shadow">
							<p>{i18n.connectWallet}</p>
						</ConnectWalletButton>
					)}
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
										theme === 'system'
											? 'text-skin-muted'
											: 'text-skin-highlight'
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
											<p
												className={`font-semibold ${
													active ? 'text-skin-highlight' : ''
												}`}
											>
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
			<main className={`flex-1 ${noPadding ? '' : 'px-4 pt-14'}`}>
				{children}
			</main>
			<div className="fx justify-end gap-2 mx-4 my-3 text-skin-muted text-sm">
				<A href="TODO" className="brightness-button">
					Twitter
				</A>
				<A href="TODO" className="brightness-button">
					GitHub
				</A>
				<A href="TODO" className="brightness-button">
					Discord
				</A>
			</div>
		</div>
	);
};

export default connect(PageContainer);
