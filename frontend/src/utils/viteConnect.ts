import Connector from '@vite/connector';

export const VCSessionKey = 'vcSession';

export class VC extends Connector {
	constructor(session?: object, meta?: { session: object; bridge: string }) {
		super(session, meta);
		this.on('connect', (err: Error, payload: { params: [{ accounts: string[] }] }) => {
			const { accounts } = payload.params[0];
			this.setAccState(accounts);
		});
		this.on('disconnect', () => {
			this.stopBizHeartBeat(); // stop heart beat when disconnected
			localStorage.removeItem(VCSessionKey);
		});
		this.on('session_update', (update: null | { session: { accounts: string[] } }) => {
			if (update) {
				const { session } = update;
				if (session && session.accounts) {
					this.setAccState(session.accounts);
				}
			}
		});
	}

	setAccState(accounts: string[] = []) {
		if (!accounts || !accounts[0]) throw new Error('address is null');
		this.saveSession();
	}

	saveSession() {
		const sessionData = {
			session: this.session,
			timestamp: new Date().getTime(),
		};
		localStorage.setItem(VCSessionKey, JSON.stringify(sessionData));
	}

	async createSession() {
		await super.createSession();
		return this.uri;
	}

	async signAndSendTx(params: object[]) {
		return new Promise((resolve, reject) => {
			this.sendCustomRequest({ method: 'vite_signAndSendTx', params })
				.then((result: object) => {
					this.saveSession();
					resolve(result);
				})
				.catch((e: Error) => reject(e));
		});
	}
}

export function getValidVCSession() {
	let sessionData = null;
	let session = null;
	try {
		const tm = localStorage.getItem(VCSessionKey);
		if (tm) {
			sessionData = JSON.parse(tm);
		}
	} catch (err) {
		console.warn(err);
	}
	if (sessionData && sessionData.timestamp) {
		// 60 minutes
		if (new Date().getTime() - sessionData.timestamp < 1000 * 60 * 10) {
			// console.log('Found session on localStorage.');
			session = sessionData.session;
		} else {
			// console.log('Found session on localStorage, but it has expired.');
			localStorage.removeItem(VCSessionKey);
		}
	}
	return session;
}

export function initViteConnect(session?: object) {
	return new VC({
		session,
		bridge: 'wss://biforst.vite.net',
	});
}
