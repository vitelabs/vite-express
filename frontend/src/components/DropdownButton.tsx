import { ReactNode, useRef, useState } from 'react';
import { useKeyPress } from '../utils/hooks';

type Props = {
	buttonJsx: ReactNode;
	dropdownJsx: ReactNode;
};

const DropdownButton = ({ buttonJsx, dropdownJsx }: Props) => {
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

export default DropdownButton;
