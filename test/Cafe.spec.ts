import { describe } from 'mocha';
import { expect } from 'chai';
const vuilder = require('@vite/vuilder');
import config from './vite.config.json';

let provider: any;
let deployer: any;

describe('test Cafe', () => {
	before(async function () {
		provider = vuilder.newProvider(config.networks.local.http);
		console.log(await provider.request('ledger_getSnapshotChainHeight'));
		deployer = vuilder.newAccount(config.networks.local.mnemonic, 0, provider);
		console.log('deployer', deployer.address);
	});

	it('test buy coffee', async () => {
		// compile
		const compiledContracts = await vuilder.compile('Cafe.solpp');
		expect(compiledContracts).to.have.property('Cafe');

		// deploy
		let cafe = compiledContracts.Cafe;
		cafe.setDeployer(deployer).setProvider(provider);
		await cafe.deploy({});
		expect(cafe.address).to.be.a('string');
		console.log(cafe.address);

		// check default balance
		expect(await cafe.balance()).to.be.equal('0');
		// check default value of data
		expect(await cafe.query('price', [])).to.be.deep.equal(['1000000000000000000']);

		// call Cafe.buyCoffee(to, numOfCups);
		const block = await cafe.call(
			'buyCoffee',
			['vite_3345524abf6bbe1809449224b5972c41790b6cf2e22fcb5caf', 2],
			{ amount: '2000000000000000000' }
		);

		// console.log(block);
		const events = await cafe.getPastEvents('Buy', {
			fromHeight: block.height,
			toHeight: block.height,
		});
		expect(events.map((event: any) => event.returnValues)).to.be.deep.equal([
			{
				'0': 'vite_61214664a1081e286152011570993a701735f5c2c12198ce63',
				'1': 'vite_3345524abf6bbe1809449224b5972c41790b6cf2e22fcb5caf',
				'2': '2',
				from: 'vite_61214664a1081e286152011570993a701735f5c2c12198ce63',
				to: 'vite_3345524abf6bbe1809449224b5972c41790b6cf2e22fcb5caf',
				num: '2',
			},
		]);

		expect(await cafe.balance()).to.be.equal('0');
	});
});
