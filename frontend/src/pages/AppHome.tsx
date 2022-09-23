import { LinkIcon } from '@heroicons/react/outline';
import { constant, wallet } from '@vite/vitejs';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import TextInput, { useTextInputRef } from '../containers/TextInput';
import CafeContract from '../contracts/Cafe';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { validateInputs } from '../utils/misc';
import { toQueryString, toSmallestUnit } from '../utils/strings';
import { State } from '../utils/types';

type Props = State;

const AppHome = ({
	copyWithToast,
	i18n,
	activeAddress,
	vpAddress,
	callContract,
	setState,
}: Props) => {
	useTitle(i18n.app);
	const [searchParams] = useSearchParams();
	const [promptTxConfirmation, promptTxConfirmationSet] = useState(false);
	const addressRef = useTextInputRef();
	const amountRef = useTextInputRef();

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			<p className="text-2xl">Buy me a coffee</p>
			{!activeAddress && <p className="text-xl">{i18n.connectWalletToUseDapp}</p>}
			<TextInput
				_ref={addressRef}
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
				label={i18n.amount}
				initialValue={searchParams.get('amount')}
				getIssue={(v) => {
					if (+v <= 0) {
						return i18n.amountMustBePositive;
					}
				}}
			/>
			<div className="fx gap-7">
				<button
					className={`${
						activeAddress ? 'bg-skin-medlight brightness-button' : 'bg-gray-400'
					} h-8 px-3 rounded-md font-semibold text-white shadow`}
					disabled={!activeAddress}
					onClick={async () => {
						if (validateInputs([addressRef, amountRef])) {
							promptTxConfirmationSet(true);
							try {
								const thing = await callContract(
									CafeContract,
									'buyCoffee',
									[addressRef.value.trim(), amountRef.value.trim()],
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
				<button
					className="h-10 w-10 rounded-full xy bg-skin-foreground brightness-button"
					onClick={() => {
						const { host, pathname } = window.location;
						copyWithToast(
							host +
								pathname +
								toQueryString({
									address: addressRef.value.trim(),
									amount: amountRef.value.trim(),
								})
						);
					}}
				>
					<LinkIcon className="w-8 text-skin-secondary" />
				</button>
			</div>
			{!!promptTxConfirmation && (
				<Modal onClose={() => promptTxConfirmationSet(false)}>
					<p className="text-center text-lg font-semibold">
						{vpAddress
							? i18n.confirmTransactionOnVitePassport
							: i18n.confirmTransactionOnYourViteWalletApp}
					</p>
				</Modal>
			)}
		</div>
	);
};

export default connect(AppHome);
