import { abi as abiUtil, utils } from '@vite/vitejs';
import { ViteAPI } from '@vite/vitejs/distSrc/utils/type';

export const getPastEvents = async (
	viteApi: ViteAPI,
	contractAddress: string,
	contractAbi: any[],
	eventName = 'allEvents',
	{
		fromHeight = 0,
		toHeight = 0,
	}: {
		fromHeight?: number;
		toHeight?: number;
	}
) => {
	const result: any[] = [];
	const logs = await viteApi.request('ledger_getVmLogsByFilter', {
		addressHeightRange: {
			[contractAddress!]: {
				fromHeight: fromHeight.toString(),
				toHeight: toHeight.toString(),
			},
		},
	});
	const filteredAbi =
		eventName === 'allEvents'
			? contractAbi
			: contractAbi.filter((a: any) => {
					return a.name === eventName;
			  });
	if (logs) {
		for (const log of logs) {
			const vmLog = log.vmlog;
			const topics = vmLog.topics;
			for (const abiItem of filteredAbi) {
				const signature = abiUtil.encodeLogSignature(abiItem);
				if (abiItem.type === 'event' && signature === topics[0]) {
					let dataHex;
					if (vmLog.data) {
						dataHex = utils._Buffer.from(vmLog.data, 'base64').toString('hex');
					}
					const returnValues = abiUtil.decodeLog(abiItem, dataHex, topics);
					const item = {
						returnValues: returnValues,
						event: abiItem.name,
						raw: {
							data: dataHex,
							topics: topics,
						},
						signature: signature,
						accountBlockHeight: log.accountBlockHeight,
						accountBlockHash: log.accountBlockHash,
						address: log.address,
					};
					result.push(item);
					break;
				}
			}
		}
	}
	return result;
};
