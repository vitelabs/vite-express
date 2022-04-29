import { RefObject, useEffect, useRef } from 'react';

export const useKeyPress = (
	targetKey: string,
	handler: () => void,
	allowDefault?: boolean
) => {
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

// https://usehooks-ts.com/react-hook/use-event-listener
export const useEventListener = <T extends HTMLElement = HTMLDivElement>(
	eventName: keyof WindowEventMap | string, // string to allow custom event
	handler: (event: Event) => void,
	element?: RefObject<T>
) => {
	const savedHandler = useRef<(event: Event) => void>();
	useEffect(() => {
		// Define the listening target
		const targetElement: T | Window = element?.current || window;
		if (!(targetElement && targetElement.addEventListener)) {
			return;
		}

		// Update saved handler if necessary
		if (savedHandler.current !== handler) {
			savedHandler.current = handler;
		}

		// Create event listener that calls handler function stored in ref
		const eventListener = (event: Event) => {
			// eslint-disable-next-line no-extra-boolean-cast
			if (!!savedHandler?.current) {
				savedHandler.current(event);
			}
		};

		targetElement.addEventListener(eventName, eventListener);

		// Remove event listener on cleanup
		return () => {
			targetElement.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element, handler]);
};
