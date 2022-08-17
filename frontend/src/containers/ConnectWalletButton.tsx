import { LogoutIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import DropdownButton from '../components/DropdownButton';
import Modal from '../components/Modal';
import QR from '../components/QR';
import { networkList } from '../utils/constants';
import { connect } from '../utils/globalContext';
import { shortenAddress } from '../utils/strings';
import { State } from '../utils/types';
import { initViteConnect } from '../utils/viteConnect';

type Props = State & {
	className?: string;
};

const ConnectWalletButton = ({ setState, i18n, activeAddress, vcInstance, vpAddress }: Props) => {
	const [connectURI, connectURISet] = useState('');

	useEffect(() => {
		if (vcInstance) {
			vcInstance.on('disconnect', () => setState({ vcInstance: undefined }));
		}
	}, [setState, vcInstance]);

	useEffect(() => {
		let unsubscribe = () => {};
		if (window?.vitePassport?.on) {
			unsubscribe = window.vitePassport.on('accountChange', (payload) => {
				setState({ vpAddress: payload.activeAddress });
			});
		}
		return unsubscribe;
	}, [setState]);

	useEffect(() => {
		if (activeAddress) {
			connectURISet('');
		}
	}, [activeAddress]);

	return activeAddress ? (
		<DropdownButton
			buttonJsx={<p>{shortenAddress(activeAddress)}</p>}
			dropdownJsx={
				<button
					className="fx px-2 py-0.5 h-7 gap-2"
					onClick={() => {
						if (vpAddress && window?.vitePassport?.disconnectWallet) {
							setState({ vpAddress: undefined });
							window.vitePassport.disconnectWallet();
						} else {
							vcInstance!.killSession();
						}
					}}
					onMouseDown={(e) => e.preventDefault()}
				>
					<LogoutIcon className="h-full text-skin-muted" />
					<p className="font-semibold">{i18n.logOut}</p>
				</button>
			}
		/>
	) : (
		<>
			<button
				className="bg-skin-medlight h-8 px-3 rounded-md brightness-button font-semibold text-white shadow"
				onClick={async () => {
					vcInstance = initViteConnect();
					connectURISet(await vcInstance.createSession());
					vcInstance.on('connect', () => setState({ vcInstance }));
				}}
			>
				<p>{i18n.connectWallet}</p>
			</button>
			{!!connectURI && (
				<Modal onClose={() => connectURISet('')}>
					<p className="text-center text-lg mb-3 font-semibold">{i18n.scanWithYourViteWalletApp}</p>
					<div className="xy">
						<QR data={connectURI} />
					</div>
					<p className="text-center text-lg my-3 font-semibold">{i18n.or}</p>
					<button
						className="bg-skin-medlight h-8 w-full rounded-md brightness-button font-semibold text-white shadow"
						onClick={async () => {
							if (window?.vitePassport) {
								try {
									await window.vitePassport.connectWallet();
									const activeNetwork = await window.vitePassport.getNetwork();
									setState({
										vpAddress: await window.vitePassport.getConnectedAddress(),
										activeNetworkIndex: networkList.findIndex(
											(n) => n.rpcUrl === activeNetwork.rpcUrl
										),
									});
								} catch (error) {
									setState({ toast: error });
								}
							} else {
								setState({ toast: i18n.vitePassportNotDetected });
							}
						}}
					>
						{i18n.connectWithVitePassport}
					</button>
				</Modal>
			)}
		</>
	);
};

export default connect(ConnectWalletButton);
