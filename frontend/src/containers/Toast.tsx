import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from '../utils/globalContext';
import { State } from '../utils/types';

type Props = State;

let visibleTimer: NodeJS.Timeout;
let closeTimer: NodeJS.Timeout;

const toastParent: HTMLElement = document.getElementById('toast')!;

const Toast = ({ setState, toast }: Props) => {
	const [visible, visibleSet] = useState(false);
	useEffect(() => {
		clearTimeout(visibleTimer);
		clearTimeout(closeTimer);
		if (toast) {
			setTimeout(() => visibleSet(true), 0); // setTimeout gives the component time to mount before animating - else the beginning scale animation is cut off
			visibleTimer = setTimeout(() => {
				visibleSet(false);
				closeTimer = setTimeout(() => setState({ toast: '' }), 300);
			}, 3000);
		}
	}, [setState, toast]);

	return !toast || !toastParent
		? null
		: ReactDOM.createPortal(
				<div className="fixed z-50 top-5 w-full pointer-events-none xy">
					<div
						className={`pointer-events-auto bg-skin-foreground relative px-4 py-3 rounded-sm overflow-hidden transition-transform duration-300 ${
							visible ? 'scale-1' : 'scale-0'
						}`}
					>
						<div className="absolute top-0 left-0 h-full w-1 toast-line-gradient" />
						<p>{toast}</p>
					</div>
				</div>,
				toastParent
		  );
};

export default connect(Toast);
