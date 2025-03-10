import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import InstantExpenses from './components/InstantExpenses';
import AddIncome from './components/AddIncome';
import AddFinancialOperation from './components/AddFinancialOperation';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Profile from './components/Profile';
import CoursesScreen from './components/CoursesScreen';
import { useAuthStore } from './store/authStore';
import { API_BASE_URL } from './config';
import Subscribe from './components/Subscribe';
import CourseDetailScreen from './components/CourseDetailScreen';
import Privacy from './components/Privacy';
import Terms from './components/Terms';

const matchPath = (path, template) => {
	if (!template.includes(':')) {
		return path === template;
	}
	const regex = new RegExp('^' + template.replace(/:[\w]+/g, '[\\w-]+') + '$');
	return regex.test(path);
};

const AppWrapper = () => {
	return (
		<Router>
			<App />
		</Router>
	);
};

const App = () => {
	const location = useLocation();

	const sidebarRoutes = [
		'/dashboard',
		'/add-expense',
		'/add-income',
		'/add-instant-expense',
		'/add-financial-operation',
		'/subscribe',
		'/settings',
		'/profile',
		'/courses',
		'/course/:id',
	];

	const noHeaderRoutes = [
		'/add-expense',
		'/add-income',
		'/add-instant-expense',
		'/add-financial-operation',
		'/subscribe',
		'/settings',
		'/profile',
		'/courses',
		'/course/:id',
	];

	const showSidebar = sidebarRoutes.some(route =>
		matchPath(location.pathname, route)
	);

	const showHeader =
		!noHeaderRoutes.some(route => matchPath(location.pathname, route)) &&
		location.pathname !== '/dashboard';

	const headerVariants = {
		initial: { opacity: 0, y: -50 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			y: -50,
			transition: {
				duration: 0.4,
				ease: 'easeIn',
			},
		},
	};

	const contentVariants = {
		initial: { opacity: 0, x: showSidebar ? 50 : 0 },
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.3,
			},
		},
		exit: {
			opacity: 0,
			x: showSidebar ? -50 : 50,
			transition: {
				duration: 0.3,
			},
		},
	};

	return (
		<div className='min-h-screen bg-gray-900 overflow-hidden'>
			<AnimatePresence>
				{showHeader && (
					<motion.div
						variants={headerVariants}
						initial='initial'
						animate='animate'
						exit='exit'
					>
						<Header />
					</motion.div>
				)}
			</AnimatePresence>

			{showSidebar && <Sidebar />}

			<AnimatePresence mode='wait'>
				<motion.div
					className={`flex-1 bg-gray-900 text-gray-200 ${
						showSidebar ? 'md:ml-64' : ''
					}`}
					variants={contentVariants}
					initial='initial'
					animate='animate'
					exit='exit'
					key={location.pathname}
				>
					<Routes location={location}>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/courses' element={<CoursesScreen />} />
						<Route path='/settings' element={<Settings />} />
						<Route path='/add-expense' element={<AddExpense />} />
						<Route path='/course/:id' element={<CourseDetailScreen />} />
						<Route path='/add-instant-expense' element={<InstantExpenses />} />
						<Route path='/add-income' element={<AddIncome />} />
						<Route path='/privacy' element={<Privacy />} />
						<Route path='/terms' element={<Terms />} />
						<Route
							path='/add-financial-operation'
							element={<AddFinancialOperation />}
						/>
						<Route path='/subscribe' element={<Subscribe />} />
						<Route path='*' element={<LoginPage />} />
					</Routes>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default AppWrapper;
