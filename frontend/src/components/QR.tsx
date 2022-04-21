import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QR = React.memo(
	({
		data,
		...rest
	}: React.HTMLProps<HTMLDivElement> & {
		data: string;
	}) => {
		const [src, srcSet] = useState('');

		useEffect(() => {
			QRCode.toString(data, { type: 'svg', margin: 0 }).then(
				(url: string) => {
					srcSet(url);
				},
				(e) => window.alert('QR error: ' + JSON.stringify(e))
			);
		}, [data]);

		return (
			<div {...rest}>
				<div
					{...{ dangerouslySetInnerHTML: { __html: src } }}
					className="p-1.5 h-64 w-64 bg-white"
				/>
			</div>
		);
	}
);

export default QR;
