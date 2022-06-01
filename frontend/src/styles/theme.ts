import { prefersDarkTheme } from '../utils/misc';

if (!localStorage.theme) {
	localStorage.theme = 'system';
}

if (localStorage.theme === 'dark' || (localStorage.theme === 'system' && prefersDarkTheme)) {
	document.documentElement.classList.add('dark');
} else {
	document.documentElement.classList.remove('dark');
}

// does not exist on older browsers
if (window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener) {
	window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', (e) => {
		if (localStorage.theme === 'system') {
			if (e.matches) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
}
