import { useCallback, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';

type Props = {
	value: string;
	options: string[] | [any, string][];
	onUserInput: (value: string) => void;
};

const Select = ({ value, options, onUserInput }: Props) => {
	const select = useRef<HTMLSelectElement>(null);

	return (
		<div className="xy relative">
			<ChevronDownIcon className="w-5 text-skin-muted absolute right-0" />
			<select
				ref={select}
				className="text-sm font-semibold cursor-pointer text-skin-muted z-10 pr-5"
				onChange={(e) => onUserInput(e.target.value)}
				value={value}
			>
				{options.map((value) => {
					if (typeof value === 'string') {
						return <option key={value}>{value}</option>;
					}
					return (
						<option key={value[0]} value={value[0]}>
							{value[1]}
						</option>
					);
				})}
			</select>
		</div>
	);
};

export default Select;
