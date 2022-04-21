import { constant, wallet } from '@vite/vitejs';
import { useRef, useState } from 'react';
import TextInput, { TextInputRefObject } from '../components/TextInput';
import ExampleContract from '../contracts/ExampleContract';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { validateInputs } from '../utils/misc';
import { toSmallestUnit } from '../utils/strings';
import { State } from '../utils/types';

type Props = State & {};

const AppHome = ({ i18n, vcInstance, callContract }: Props) => {
	useTitle('App');
	const [beneficiaryAddress, beneficiaryAddressSet] = useState('');
	const [amount, amountSet] = useState('');
	const beneficiaryAddressRef = useRef<TextInputRefObject>();
	const amountRef = useRef<TextInputRefObject>();

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			{vcInstance ? (
				<>
					<TextInput
						_ref={beneficiaryAddressRef}
						label="Beneficiary address"
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
						label="Amount"
						value={amount}
						onUserInput={(v) => amountSet(v)}
						getIssue={(v) => {
							if (+v <= 0) {
								return i18n.amountMustBePositive;
							}
						}}
					/>
					<button
						className="bg-skin-medlight h-8 px-3 rounded-md brightness-button font-semibold text-white shadow"
						onClick={() => {
							if (validateInputs([beneficiaryAddressRef, amountRef])) {
								callContract(
									ExampleContract,
									'buyCoffee',
									[beneficiaryAddress, amount],
									constant.Vite_TokenId,
									toSmallestUnit(amount, constant.Vite_Token_Info.decimals)
								);
							}
						}}
					>
						{i18n.buyCoffee}
					</button>
				</>
			) : (
				<p className="">Connect wallet to use dapp</p>
			)}
		</div>
	);
};

export default connect(AppHome);
