import A from '../components/A';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';

type Props = State;

const Landing = ({ i18n }: Props) => {
	useTitle('');
	return (
		<div>
			<div className="bg-skin-base">
				<div className="xy flex-col h-[25rem] max-h-screen">
					<p className="text-4xl font-extrabold">Vite Express</p>
					<p className="mt-2 text-3xl text-center text-skin-secondary">
						Let's build something cool
					</p>
					<A
						to="/app"
						className="mt-9 font-semibold rounded-lg px-4 py-1 text-xl bg-skin-highlight text-white shadow brightness-button"
					>
						{i18n.launchApp}
					</A>
				</div>
			</div>
		</div>
	);
};

export default connect(Landing);
