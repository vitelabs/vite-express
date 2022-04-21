import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = React.HTMLProps<HTMLAnchorElement> & {
	to?: string;
};

const A = ({ to, href, children, className }: Props) => {
	const navigate = useNavigate();
	return to ? (
		<button onClick={() => navigate(to)} className={className}>
			{children}
		</button>
	) : (
		<a href={href} target="_blank" rel="noopener noreferrer" className={className}>
			{children}
		</a>
	);
};

export default A;
