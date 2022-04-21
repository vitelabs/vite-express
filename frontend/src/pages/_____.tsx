import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';

type Props = State & {};

const _____ = ({ i18n }: Props) => {
	useTitle('');
	return (
		<div className="">
			<p>_____</p>
		</div>
	);
};

export default connect(_____);
