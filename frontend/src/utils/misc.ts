import { TextInputRefObject } from '../containers/TextInput';

export const isDarkMode = () => document.documentElement.classList.contains('dark');

export const prefersDarkTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

export const validateInputs = (
	// inputRefs: React.MutableRefObject<TextInputRefObject | undefined>[]
	inputRefs: TextInputRefObject[]
) => {
	let allRefsInputsAreValid = true;
	for (const ref of inputRefs) {
		let isValid = ref.isValid;
		// if (typeof isValid === 'object') {
		//   const issue = await isValid;
		//   if (issue) {
		//     allRefsInputsAreValid = false;
		//   }
		// }
		if (!isValid) {
			allRefsInputsAreValid = false;
		}
	}
	return allRefsInputsAreValid;
};
