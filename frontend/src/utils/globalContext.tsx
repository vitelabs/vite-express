import React, { useCallback, useState } from 'react';
import { State } from './types';

// https://stackoverflow.com/a/51365037/13442719
type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object
		? RecursivePartial<T[P]>
		: T[P];
};

export type setStateType = (state: RecursivePartial<State>, meta?: { deepMerge?: boolean }) => void;

type HOCProps = {
	state: object;
	setState: setStateType;
};

// https://stackoverflow.com/a/58405003/13442719
const GlobalContext = React.createContext<HOCProps>(undefined!);

type ProviderProps = {
	children: React.ReactNode;
	initialState?: object;
	onSetState?: setStateType;
};

export const Provider = ({ children, initialState, onSetState }: ProviderProps) => {
	const [state, stateSet] = useState({ ...(initialState || {}) });

	const setState = useCallback<setStateType>(
		(stateChanges, options = {}) => {
			stateSet((prevState) => {
				const newState = options.deepMerge
					? deepMerge({ ...prevState }, stateChanges)
					: { ...prevState, ...stateChanges };
				onSetState && onSetState(newState, options);
				return newState;
			});
		},
		[onSetState]
	);
	return <GlobalContext.Provider value={{ state, setState }}>{children}</GlobalContext.Provider>;
};

export const deepMerge = (target: { [key: string]: any }, source: { [key: string]: any }) => {
	if (target && source) {
		for (const key in source) {
			if (
				source[key] instanceof Object &&
				!Array.isArray(source[key]) // NB: DOES NOT DEEP MERGE ARRAYS
			) {
				Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
			}
		}
		Object.assign(target, source);
		return target;
	}
	return target || source;
};

// https://stackoverflow.com/a/56989122/13442719
export const connect = <T,>(Component: React.ComponentType<T>) => {
	return (props: any) => (
		<GlobalContext.Consumer>
			{(value: { state: object; setState: setStateType }) => (
				<Component {...props} {...value.state} setState={value.setState} />
			)}
		</GlobalContext.Consumer>
	);
};
