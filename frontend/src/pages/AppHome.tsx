import { constant, wallet } from '@vite/vitejs';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import TextInput, { useTextInputRef } from '../containers/TextInput';
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
	const addressRef = useTextInputRef();
	const amountRef = useTextInputRef();

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			<p className="text-2xl">Buy me a coffee</p>
			{!vcInstance && <p className="text-xl">{i18n.connectWalletToUseDapp}</p>}
			<TextInput
				_ref={addressRef}
				disabled={!vcInstance}
				label={i18n.beneficiaryAddress}
				initialValue={searchParams.get('address')}
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
				maxDecimals={18}
				initialValue={searchParams.get('amount')}
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
					if (validateInputs([addressRef, amountRef])) {
						promptTxConfirmationSet(true);
						try {
							const thing = await callContract(
								CafeContract,
								'buyCoffee',
								[addressRef.value, amountRef.value],
								constant.Vite_TokenId,
								toSmallestUnit(amountRef.value, constant.Vite_Token_Info.decimals)
							);
							console.log('thing:', thing);
							setState({ toast: i18n.transactionConfirmed });
							addressRef.value = '';
							amountRef.value = '';
							promptTxConfirmationSet(false);
						} catch (error) {
							promptTxConfirmationSet(false);
							setState({ toast: error });
						}
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
