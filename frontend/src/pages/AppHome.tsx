import { constant, wallet } from '@vite/vitejs';
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import TextInput, { TextInputRefObject } from '../components/TextInput';
import CafeContract from '../contracts/Cafe';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { validateInputs } from '../utils/misc';
import { toSmallestUnit } from '../utils/strings';
import { State } from '../utils/types';

type Props = State & {};

const AppHome = ({ i18n, vcInstance, callContract, setState }: Props) => {
	useTitle(i18n.app);
	const [searchParams] = useSearchParams();
	const [promptTxConfirmation, promptTxConfirmationSet] = useState(false);
	const [beneficiaryAddress, beneficiaryAddressSet] = useState(searchParams.get('address') || '');
	const [amount, amountSet] = useState(searchParams.get('amount') || '');
	const beneficiaryAddressRef = useRef<TextInputRefObject>();
	const amountRef = useRef<TextInputRefObject>();

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			<p className="text-2xl">Buy me a coffee</p>
			{!vcInstance && <p className="text-xl">{i18n.connectWalletToUseDapp}</p>}
			<TextInput
				_ref={beneficiaryAddressRef}
				disabled={!vcInstance}
				label={i18n.beneficiaryAddress}
				value={beneficiaryAddress}
				onUserInput={(v) => beneficiaryAddressSet(v.trim())}
				getIssue={(v) => {
					if (!wallet.isValidAddress(v)) {
						return i18n.invalidAddress;
					}
				}}
			/>
			<TextInput
				numeric
				_ref={amountRef}
				disabled={!vcInstance}
				label={i18n.amount}
				value={amount}
				maxDecimals={18}
				onUserInput={(v) => amountSet(v)}
				getIssue={(v) => {
					if (+v <= 0) {
						return i18n.amountMustBePositive;
					}
					if (+v % 1 !== 0) {
						return i18n.positiveIntegersOnly;
					}
				}}
			/>
			<button
				className={`${
					vcInstance ? 'bg-skin-medlight brightness-button' : 'bg-gray-400'
				} h-8 px-3 rounded-md font-semibold text-white shadow`}
				disabled={!vcInstance}
				onClick={async () => {
					if (validateInputs([beneficiaryAddressRef, amountRef])) {
						promptTxConfirmationSet(true);
						await callContract(
							CafeContract,
							'buyCoffee',
							[beneficiaryAddress, amount],
							constant.Vite_TokenId,
							toSmallestUnit(amount, constant.Vite_Token_Info.decimals)
						);
						setState({ toast: i18n.transactionConfirmed });
						beneficiaryAddressSet('');
						amountSet('');
						promptTxConfirmationSet(false);
					}
				}}
			>
				{i18n.buyCoffee}
			</button>
			{!!promptTxConfirmation && (
				<Modal onClose={() => promptTxConfirmationSet(false)}>
					<p className="text-center text-lg font-semibold">
						{i18n.confirmTransactionOnYourViteWalletApp}
					</p>
				</Modal>
			)}
		</div>
	);
};

export default connect(AppHome);
