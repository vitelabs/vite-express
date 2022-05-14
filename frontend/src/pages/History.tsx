import { RefreshIcon } from '@heroicons/react/outline';
import { useCallback, useEffect, useState } from 'react';
import Cafe from '../contracts/Cafe';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { shortenAddress } from '../utils/strings';
import { CoffeeBuyEvent, State } from '../utils/types';
import { getPastEvents } from '../utils/viteScripts';

type Props = State & {};

const History = ({ i18n, viteApi, networkType, setState }: Props) => {
	useTitle(i18n.history);
	const [events, eventsSet] = useState<CoffeeBuyEvent[]>();

	const updateEvents = useCallback(() => {
		eventsSet(undefined);
		const contractAddress = Cafe.address[networkType];
		getPastEvents(viteApi, contractAddress, Cafe.abi, 'Buy', {
			fromHeight: 0,
			toHeight: 0,
		})
			.then((events) => {
				// console.log('events:', events);
				eventsSet(events);
			})
			.catch((e) => {
				console.log('e:', e);
				setState({ toast: JSON.stringify(e) });
			});
	}, [viteApi, networkType, setState]);

	useEffect(() => {
		updateEvents();
	}, [updateEvents]);

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			<p className="text-2xl">{i18n.history}</p>
			<div className="">
				<div className="flex">
					<div className="flex-1">
						<p className="">{i18n.cups}</p>
					</div>
					<div className="flex-1">
						<p className="">{i18n.from}</p>
					</div>
					<div className="flex justify-between flex-1">
						<p className="">{i18n.to}</p>
						<button className="p-1" onClick={updateEvents}>
							<RefreshIcon className="w-5" />
						</button>
					</div>
				</div>
				{events ? (
					events.map((event) => {
						return (
							<div className="flex" key={event.accountBlockHash}>
								<div className="flex-1">
									<p className="">{event.returnValues.num}</p>
								</div>
								<div className="flex-1">
									<p className="">{shortenAddress(event.returnValues.from)}</p>
								</div>
								<div className="flex-1">
									<p className="">{shortenAddress(event.returnValues.to)}</p>
								</div>
							</div>
						);
					})
				) : (
					<p className="">Loading...</p>
				)}
			</div>
		</div>
	);
};

export default connect(History);
