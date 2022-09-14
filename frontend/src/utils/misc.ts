import { TextInputRefObject } from '../containers/TextInput';

export const isDarkMode = () => document.documentElement.classList.contains('dark');

export const prefersDarkTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

export const validateInputs = (inputRefs: TextInputRefObject[]) => {
	let allRefsInputsAreValid = true;
	for (const ref of inputRefs) {
		if (!ref.isValid) {
			allRefsInputsAreValid = false;
		}
	}
	return allRefsInputsAreValid;
};
