module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:react-hooks/recommended',
		'plugin:react/jsx-runtime', // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md#when-not-to-use-it
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	plugins: ['react', '@typescript-eslint', 'react-hooks'],
	rules: {
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',

		'no-constant-condition': 'off',
		'no-case-declarations': 'off',
		'no-mixed-spaces-and-tabs': 'off',

		'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
		'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
		'react/no-unescaped-entities': 0, // https://stackoverflow.com/a/53994887/4975090
		'react/prop-types': 'off',
	},
};
