import { ReactNode, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import QR from '../components/QR';
import { connect } from '../utils/globalContext';
import { State } from '../utils/types';
import { initVC } from '../utils/viteConnect';

type Props = State & {
	children: ReactNode;
	walletType?: 'Vite Wallet' | 'MetaMask';
	className?: string;
};

const ConnectWalletButton = ({
	setState,
	i18n,
	children,
	walletType,
	className,
	vcInstance,
}: Props) => {
	const [connectURI, connectURISet] = useState('');
	useEffect(() => {
		if (vcInstance) {
			vcInstance.on('disconnect', () => setState({ vcInstance: undefined }));
		}
	}, [setState, vcInstance]);

	return (
		<>
			<button
				className={className}
				onClick={async () => {
					vcInstance = initVC();
					connectURISet(await vcInstance.createSession());
					vcInstance.on('connect', () => setState({ vcInstance }));
				}}
			>
				{children}
			</button>
			{!!connectURI && (
				<Modal onClose={() => connectURISet('')}>
					<p className="text-center text-lg mb-3 font-semibold">
						{i18n.scanWithYourViteWalletApp}
					</p>
					<div className="xy">
						<QR data={connectURI} />
					</div>
				</Modal>
			)}
		</>
	);
};

export default connect(ConnectWalletButton);
