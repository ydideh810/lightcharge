import { IconButton } from '@chakra-ui/button';
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode';
import {Link} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Switch } from '@chakra-ui/switch';
import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import {FaMoon, FaSun} from 'react-icons/fa';
import { createUseStyles } from 'react-jss';
import { AboutUsUrl, colors, FAQUrl, FeedbackUrl, styles } from '../../constants';

const useStyles = createUseStyles({
	menuList: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		minWidth: '150px',
		padding: 0,
		borderRadius: 12,
		overflow: 'hidden',
		'& button': {
			'& a': {
				textAlign: 'center',
				width: '100%',
				height: '100%',
			},
			'&:hover': {
				backgroundColor: colors.primaryTint,
			},
			'&:active': {
				backgroundColor: colors.primaryTint,
			},
			'&:focus': {
				backgroundColor: colors.primaryTint,
			},
		},

	},
	menuItem: {
		display: 'flex',
		justifyContent: 'center',
		padding: '10px 0px',
	},
	switchContainer: {
		paddingTop: '5px',
		paddingBottom: '10px',
		position: 'relative',
	},
	iconNight: {
		position: 'absolute',
		right: '5.5px',
		top: 11,
		pointerEvents: 'none',
	},
	iconDay: {
		position: 'absolute',
		left: '5.5px',
		top: 11,
		pointerEvents: 'none',
	},
});

export const NavMenu = ({logout}:{logout:any}) => {
	const classes = useStyles();
	const {colorMode, toggleColorMode} = useColorMode();
	const textColor = useColorModeValue(colors.textBlack, colors.textWhite);
	const backgroundColor = useColorModeValue(colors.bgWhite, colors.bgDark);
	const iconClassName = useColorModeValue(classes.iconNight, classes.iconDay);
	const SwitchIcon = useColorModeValue(FaMoon, FaSun);

	return (
		<Menu placement="bottom-end" >
			<MenuButton
				as={IconButton}
				aria-label="options"
				borderRadius="50%"
				color={textColor}
				backgroundColor={backgroundColor}
				icon={<Icon as={FiMoreHorizontal} boxSize="30px"/>}
				variant="solid"
				sx={styles.buttonCommon}
			/>
			<MenuList width="150px" className={classes.menuList}>
				<MenuItem className={classes.menuItem}>
					<Link href={AboutUsUrl} isExternal>
                    About
					</Link>
				</MenuItem>
				<MenuItem className={classes.menuItem}>
					<Link href={FAQUrl} isExternal>
                    FAQ
					</Link>
				</MenuItem>
				<MenuItem className={classes.menuItem}>
					<Link href={FeedbackUrl} isExternal>
                    Feedback
					</Link>
				</MenuItem>
				<MenuItem className={classes.menuItem} onClick={logout}>
                    LogOut
				</MenuItem>
				<Box className={classes.switchContainer}>
					<Switch
						colorScheme="blackAlpha"
						size="lg"
						isChecked={colorMode === 'light'}
						onChange={toggleColorMode}
					/>
					<Icon className={iconClassName} as={SwitchIcon}/>
				</Box>

			</MenuList>
		</Menu>
	);
};
