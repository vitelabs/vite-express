import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useKeyPress } from '../utils/hooks';

type Props = {
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
};

const modalParent = document.getElementById('modal')!;

const Modal = ({ onClose = () => {}, children, className }: Props) => {
	const mouseDraggingModal = useRef(false);
	const [index, indexSet] = useState<number>();

	useEffect(() => {
		indexSet(modalParent?.children.length);
	}, []); // eslint-disable-line

	useKeyPress('Escape', () => {
		if (modalParent?.children.length === index) {
			onClose();
		}
	});

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			if (!modalParent?.children.length) {
				document.body.style.overflow = 'visible';
			}
		};
	}, [modalParent?.children.length]);

	return ReactDOM.createPortal(
		<div
			className="z-50 fixed inset-0 bg-tinted overflow-scroll flex flex-col bg-black bg-opacity-20"
			onClick={() => {
				!mouseDraggingModal.current && onClose();
				mouseDraggingModal.current = false;
			}}
		>
			<div className="flex-1 min-h-[5rem]" />
			<div className="px-4 flex justify-center">
				<div
					className={`bg-skin-middleground rounded-lg p-4 ${className}`}
					onClick={(e) => e.stopPropagation()}
					onMouseDown={() => (mouseDraggingModal.current = true)}
					onMouseUp={() => (mouseDraggingModal.current = false)}
				>
					{children}
				</div>
			</div>
			<div className="flex-1 min-h-[5rem]"></div>
		</div>,
		modalParent
	);
};

export default Modal;
