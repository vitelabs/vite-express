import BigNumber from 'bignumber.js';

export const shortenString = (str: string, startCount = 8, endCount = 5) =>
	str.slice(0, startCount) + '...' + str.slice(-endCount);
export const shortenAddress = (address: string) => shortenString(address, 8, 5);
export const shortenHash = (hash: string) => shortenString(hash, 5, 5);
export const shortenTti = (hash: string) => shortenString(hash, 7, 5);

// https://www.30secondsofcode.org/js/s/copy-to-clipboard-async?from=autocomplete
export const copyToClipboardAsync = (str = '') => {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText)
		return navigator.clipboard.writeText(str);
	return window.alert('The Clipboard API is not available.');
};

export const toBiggestUnit = (num: string, decimals = 0) => {
	return new BigNumber(num).shiftedBy(-decimals).toFixed();
};

export const toSmallestUnit = (num: string, decimals = 0) => {
	return new BigNumber(num).shiftedBy(decimals).toFixed(0);
};

export const roundDownTo6Decimals = (balance: string) =>
	Math.floor(+balance * 1000000) / 1000000 + '';

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const formatDate = (date: number | Date, verbose?: boolean, utc?: boolean) => {
	if (!date) {
		return;
	}
	if (typeof date === 'number') {
		date *= 1000; // NOTE: Not sure if this project will every have timestamps in ms. For now this function assumes number dates are in seconds.
	}
	date = new Date(date);
	const year = date[`get${utc ? 'UTC' : ''}FullYear`]();
	const month = date[`get${utc ? 'UTC' : ''}Month`]();
	const day = date[`get${utc ? 'UTC' : ''}Date`]();
	const hour = date[`get${utc ? 'UTC' : ''}Hours`]();
	const minute = date[`get${utc ? 'UTC' : ''}Minutes`]();
	const second = date[`get${utc ? 'UTC' : ''}Seconds`]();

	if (verbose) {
		const minute = date.getMinutes();
		// · middle dot shift+option+9
		// • bullet option+8
		return `${year} ${MONTHS[month]} ${day} · ${date.getHours()}:${
			minute < 10 ? `0${minute}` : minute
		}`;
	}
	return `${year}-${month + 1}-${day} ${hour}:${minute}:${second}`;
};

export const makeReadable = (err: any) =>
	err.toString() === '[object Object]' ? JSON.stringify(err) : err.toString();

// https://howchoo.com/javascript/how-to-turn-an-object-into-query-string-parameters-in-javascript
export const toQueryString = (params: { [key: string]: any }) =>
	'?' +
	Object.keys(params)
		.filter((key) => !!params[key])
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
		.join('&');
