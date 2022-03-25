import { Box, Text, VStack } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import QRCode from 'react-qr-code';
import { ButtonComponent } from '../../../components/ui';

import { RiLinksLine, RiLinkUnlinkM } from 'react-icons/ri';

const useStyles = createUseStyles({
	blockText: {
		fontSize: '12px',
	},
	copyText: {
		width: '100%',
	},
});

interface IQrInvoice {
	comment: string;
	title: string;
	amount: number;
	owners: string[];
	qrCode: string;
	handleCloseButton: () => void
}

export const QrInvoice = ({
	comment, title, amount, owners, qrCode}: IQrInvoice) => {
	const classes = useStyles();

	const [copy, setcopy] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(qrCode);
		setcopy(true);
		setTimeout(() => {
			setcopy(false);
		}, 2000);
	};

	return (
		<VStack
			px={10}
			py={4}
			spacing="12px"
			width="100%"
			height="100%"
			overflowY="hidden"

			display="flex"
			alignItems="center"
			justifyContent="center"

		>
			<Box width="100%">
				<Box backgroundColor="brand.bgLightGrey" borderRadius="12px" padding="10px">
					<Text className={classes.blockText}> {`Grant: ${title}`}</Text>
					<Text className={classes.blockText}> {`The Board: ${owners.join(', ')}`}</Text>
					<Text className={classes.blockText}> {`Amount (sats): ${amount}`}</Text>
					{comment && <Text className={classes.blockText}> {`Comment: ${comment}`}</Text>}
				</Box>
			</Box>
			<QRCode value={qrCode} onClick={handleCopy} />
			<Box className={classes.copyText}>
				<ButtonComponent
					isFullWidth
					primary={copy}
					onClick={handleCopy}
					leftIcon={copy ? <RiLinkUnlinkM /> : <RiLinksLine />}
				>
					{!copy ? 'Copy Invoice' : 'Invoice Copied'}
				</ButtonComponent>
			</Box>

		</VStack>
	);
};
