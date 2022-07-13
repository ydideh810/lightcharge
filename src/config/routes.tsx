import { Box } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import {
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import { NavBar } from '../components/nav';
import { Home } from '../pages/home';
import { Project } from '../pages/project';
import { createBrowserHistory } from 'history';
import { NotFound } from '../pages/notFound';
import { GrantsLanding } from '../pages/grants/GrantsLanding';
import { LaunchIdea } from '../pages/launchIdea';
import { Profile } from '../pages/profile';
import { isMobileMode } from '../utils';
import { REACT_APP_API_ENDPOINT } from '../constants';

export const customHistory = createBrowserHistory();

export const Router = () => {
	const [isAtTop, setIsAtTop] = useState(true);
	const location = useLocation();
	const isMobile = isMobileMode();

	useEffect(() => {
		const container = document.getElementById('geyser-landing-page');
		if (container) {
			container.addEventListener('scroll', (event: any) => {
				if (event && event.target && event.target.scrollTop >= 30) {
					setIsAtTop(false);
				} else {
					setIsAtTop(true);
				}
			});
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', () => null);
			}
		};
	}, []);

	const showBorder = isAtTop && location.pathname === '/';
	return (
		<Box height="100vh">
			<NavBar showBorder={showBorder} />
			<Box id="geyser-landing-page" height={isMobile ? 'calc(100vh - 61px)' : 'calc(100vh - 71px)'} overflowY="auto">
				<Switch>
					<Route path="/.well-known/lnurlp/:username" component={() => {
						const { username } = useParams<{username: string}>();
						window.location.replace(`${REACT_APP_API_ENDPOINT}/.well-known/lnurlp/${username}`);
						return null;
					}}>
					</Route>
					<Route path="/grants">
						<GrantsLanding />
					</Route>
					<Route path="/launch">
						<LaunchIdea />
					</Route>
					<Route path="/profile/:userId">
						<Profile />
					</Route>
					<Route path="/project/:projectId">
						<Project />
					</Route>
					<Route path="/not-found">
						<NotFound />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Box>
		</Box>
	);
};
