// @ts-nocheck

import { toBiggestUnit } from './strings';
import { ViteBalanceInfo } from './types';

export const getViteTokenBalance = (viteBalanceInfo: ViteBalanceInfo, tokenId: string) => {
	if (viteBalanceInfo.balance.balanceInfoMap) {
		const { balance, tokenInfo } = viteBalanceInfo.balance.balanceInfoMap[tokenId];
		return toBiggestUnit(balance, tokenInfo.decimals);
	}
	return '0';
};
