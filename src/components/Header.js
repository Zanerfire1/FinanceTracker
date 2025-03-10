import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData'));
		setUser(userData);
	}, [location.pathname]);

	const handleLogout = () => {
		localStorage.removeItem('userData');
		localStorage.removeItem('userParameters');
		setUser(null);
		setIsLogoutConfirmOpen(false);
		setIsMobileMenuOpen(false);
		navigate('/');
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleLogoutClick = () => {
		setIsLogoutConfirmOpen(true);
	};

	const handleConfirmLogout = () => {
		handleLogout();
	};

	const handleCancelLogout = () => {
		setIsLogoutConfirmOpen(false);
	};

	const iconVariants = {
		closed: { rotate: 0, transition: { duration: 0.3 } },
		open: { rotate: 0, transition: { duration: 0.3 } },
	};

	const menuVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: 'easeOut' },
		},
		exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
	};

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
		exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
	};

	return (
		<header className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl'>
			<nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16 items-center'>
					<Link to='/' className='flex items-center space-x-2 group'>
						<svg
							className='w-8 h-8 text-emerald-400 group-hover:rotate-12 transition-transform'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<span className='text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
							FinanceTracker
						</span>
					</Link>

					<motion.button
						className='lg:hidden p-2 rounded-full bg-gray-700 text-emerald-400 hover:bg-gray-600 focus:outline-none transition-colors shadow-md'
						onClick={toggleMobileMenu}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
					>
						<motion.svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							animate={isMobileMenuOpen ? 'open' : 'closed'}
							variants={iconVariants}
						>
							<motion.path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d={
									isMobileMenuOpen
										? 'M6 18L18 6M6 6l12 12'
										: 'M4 6h16M4 12h16M4 18h16'
								}
								initial={false}
								animate={isMobileMenuOpen ? 'open' : 'closed'}
								variants={{
									closed: {
										d: 'M4 6h16M4 12h16M4 18h16',
										transition: { duration: 0.3 },
									},
									open: {
										d: 'M6 18L18 6M6 6l12 12',
										transition: { duration: 0.3 },
									},
								}}
							/>
						</motion.svg>
					</motion.button>

					<div className='hidden lg:flex items-center space-x-6'>
						{user ? (
							<div className='flex items-center space-x-6'>
								<div className='relative group'>
									<button className='flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors'>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											{user?.imageUrl ? (
												<img
													src={`${API_BASE_URL.replace('/api', '')}/${
														user.imageUrl
													}`}
													alt={user.username}
													className='w-8 h-8 rounded-full object-cover'
												/>
											) : (
												<div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium'>
													{user.username[0].toUpperCase()}
												</div>
											)}
										</motion.div>
										<span className='text-gray-200'>{user.username}</span>
										<svg
											className='w-5 h-5 text-gray-400 transform group-hover:rotate-180 transition-transform'
											fill='none'
											stroke='currentColor'
										>
											<path d='M19 9l-7 7-7-7' />
										</svg>
									</button>
									<div className='absolute right-0 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible'>
										<div className='py-1'>
											<Link
												to='/dashboard'
												className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												<svg
													className='w-6 h-5 mr-2'
													fill='none'
													stroke='currentColor'
												>
													<path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
												</svg>
												Профиль
											</Link>
											<Link
												to='/settings'
												className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												<svg
													className='w-6 h-5 mr-2'
													fill='none'
													stroke='currentColor'
												>
													<path d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
													<path d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
												</svg>
												Настройки
											</Link>
											<button
												onClick={handleLogoutClick}
												className='w-full flex items-center px-4 py-2 text-red-400 hover:bg-gray-700'
											>
												<svg
													className='w-6 h-5 mr-2'
													fill='none'
													stroke='currentColor'
												>
													<path d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
												</svg>
												Выйти
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='flex space-x-4'>
								<Link
									to='/login'
									className='px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-emerald-500/30'
								>
									Войти
								</Link>
								<Link
									to='/register'
									className='px-4 py-2 border-2 border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-500/10 transition-colors'
								>
									Регистрация
								</Link>
							</div>
						)}
					</div>

					<AnimatePresence>
						{isMobileMenuOpen && (
							<motion.div
								className='lg:hidden fixed top-16 left-4 right-4 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-40 overflow-hidden'
								initial='hidden'
								animate='visible'
								exit='exit'
								variants={menuVariants}
							>
								<div className='flex flex-col items-center py-6 space-y-4'>
									{user ? (
										<>
											<Link
												to='/dashboard'
												className='text-gray-200 hover:text-emerald-400 px-6 py-3 w-3/4 text-center bg-gray-700/50 rounded-lg transition-colors shadow-sm hover:shadow-emerald-400/20'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Профиль
											</Link>
											<Link
												to='/settings'
												className='text-gray-200 hover:text-emerald-400 px-6 py-3 w-3/4 text-center bg-gray-700/50 rounded-lg transition-colors shadow-sm hover:shadow-emerald-400/20'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Настройки
											</Link>
											<button
												onClick={handleLogoutClick}
												className='text-red-400 hover:text-red-300 px-6 py-3 w-3/4 text-center bg-gray-700/50 rounded-lg transition-colors shadow-sm hover:shadow-red-400/20'
											>
												Выйти
											</button>
										</>
									) : (
										<>
											<Link
												to='/login'
												className='px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg w-3/4 text-center shadow/md hover:from-emerald-600 hover:to-cyan-600 transition-all hover:shadow-emerald-500/30'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Войти
											</Link>
											<Link
												to='/register'
												className='px-6 py-3 border-2 border-emerald-500 text-emerald-500 rounded-lg w-3/4 text-center hover:bg-emerald-500/20 transition-colors shadow-sm hover:shadow-emerald-500/20'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Регистрация
											</Link>
										</>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{isLogoutConfirmOpen && (
							<motion.div
								className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
								initial='hidden'
								animate='visible'
								exit='exit'
								variants={modalVariants}
							>
								<div className='bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 w-full max-w-md'>
									<h3 className='text-xl font-semibold text-white mb-4 text-center'>
										Подтверждение выхода
									</h3>
									<p className='text-gray-200 mb-6 text-center'>
										Вы уверены, что хотите выйти?
									</p>
									<div className='flex gap-4 justify-center'>
										<button
											onClick={handleConfirmLogout}
											className='py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
										>
											Да, выйти
										</button>
										<button
											onClick={handleCancelLogout}
											className='py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
										>
											Отмена
										</button>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</nav>
		</header>
	);
};

export default Header;
