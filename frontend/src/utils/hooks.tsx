import { useEffect, useRef } from 'react';

export const useKeyPress = (targetKey: string, handler: () => void, allowDefault?: boolean) => {
	const savedHandler = useRef<() => void>();
	const called = useRef<boolean>();
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const onDown = (e: KeyboardEvent) => {
			if (e.key === targetKey && savedHandler.current && !called.current) {
				!allowDefault && e.preventDefault();
				savedHandler.current();
				called.current = true;
			}
		};
		const onUp = () => (called.current = false);
		if (savedHandler.current) {
			window.addEventListener('keydown', onDown);
			window.addEventListener('keyup', onUp);
		}
		return () => {
			window.removeEventListener('keydown', onDown);
			window.removeEventListener('keyup', onUp);
		};
	}, [targetKey, handler, allowDefault]);
};

export const useTitle = (title?: string) => {
	useEffect(() => {
		document.title = `${title ? `${title} - ` : ''}Vite Express`;
	}, [title]);
};
