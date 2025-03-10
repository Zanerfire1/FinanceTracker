import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config';
import {
	FaHome,
	FaMinus,
	FaPlus,
	FaShoppingCart,
	FaMoneyBillWave,
	FaCog,
	FaCheck,
	FaBars,
	FaTimes,
	FaBook,
} from 'react-icons/fa';

const Sidebar = () => {
	const user = useAuthStore(state => state.user);
	const { setUser } = useAuthStore();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [currency, setCurrency] = useState(null);
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		const syncWithLocalStorage = () => {
			const storedUser = JSON.parse(localStorage.getItem('userData')) || null;
			if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user))
				setUser(storedUser);
			if (!storedUser) {
				navigate('/login');
				return;
			}
			const currencyId = storedUser.currencyId || null;
			fetchCurrency(currencyId);
			fetchSubscriptions();
		};

		const fetchCurrency = async currencyId => {
			try {
				if (currencyId) {
					const response = await fetch(
						`${API_BASE_URL}/currency/${currencyId}`
					);
					if (!response.ok) throw new Error();
					const data = await response.json();
					setCurrency(data);
				} else {
					setCurrency({ currencyCode: 'Загрузка...' });
				}
			} catch {
				setCurrency({ currencyCode: 'Загрузка...' });
			}
		};

		const fetchSubscriptions = async () => {
			try {
				if (!user?.userId) return;
				const response = await fetch(
					`${API_BASE_URL}/courses/paid-subscribers?userId=${user.userId}`
				);
				if (!response.ok) throw new Error();
				const data = await response.json();
				const activeSubscription = data.find(
					sub => new Date(sub.subscriptionEndDate) > new Date()
				);
				setSubscription(activeSubscription || null);
			} catch {
				setSubscription(null);
			}
		};

		syncWithLocalStorage();

		const handleStorageChange = () => {
			const storedUser = JSON.parse(localStorage.getItem('userData')) || null;
			if (storedUser) {
				setUser(storedUser);
				const currencyId = storedUser.currencyId || null;
				fetchCurrency(currencyId);
				fetchSubscriptions();
			} else {
				navigate('/login');
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [user, navigate, setUser]);

	const avatarUrl = user?.imageUrl
		? `${API_BASE_URL.replace('/api', '')}/${user.imageUrl}`
		: '/images/avatar_placeholder.png';

	const handleProfileClick = () => {
		navigate('/profile');
		setIsOpen(false);
	};

	const handleNavClick = path => {
		navigate(path);
		setIsOpen(false);
	};

	return (
		<div className='relative'>
			<div className='md:hidden fixed top-0 left-0 w-full bg-gray-900 z-50 flex items-center justify-between p-4 border-b border-gray-700 shadow-md'>
				<Link
					to='/'
					className='text-2xl font-bold text-white hover:text-blue-400 transition-colors'
				>
					FinanceTracker
				</Link>
				<button onClick={() => setIsOpen(!isOpen)} className='text-white'>
					{isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
				</button>
			</div>
			<div
				className={`w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex flex-col shadow-lg border-r border-gray-700 fixed top-0 left-0 h-[100vh] z-50 ${
					isOpen ? 'block' : 'hidden md:block'
				}`}
			>
				<div className='p-6 border-b border-gray-700 bg-gray-900'>
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
				</div>
				<div
					className='p-6 flex flex-col items-center border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer'
					onClick={handleProfileClick}
				>
					<div className='relative'>
						<img
							src={avatarUrl}
							alt={user?.username || 'User'}
							className='w-20 h-20 rounded-full border-4 border-blue-600 shadow-lg object-cover transition-transform hover:scale-105'
						/>
						{subscription && (
							<FaCheck className='text-green-500 w-5 h-5 absolute bottom-0 right-0 bg-gray-800 rounded-full p-1 border-2 border-gray-700' />
						)}
					</div>
					<div className='mt-4 text-center'>
						<p className='text-lg font-semibold text-white'>
							{user?.username || 'Гость'}
						</p>
						<p className='text-sm text-gray-400'>
							{user?.email || 'Нет данных'}
						</p>
						<p className='text-sm mt-2 text-gray-300'>
							Баланс: {user?.currentBalance || 0}{' '}
							{currency ? currency.currencyCode : 'Загрузка...'}
						</p>
					</div>
				</div>
				<nav className='flex-1 px-4 py-6 overflow-y-auto'>
					<ul className='space-y-1'>
						<li>
							<button
								onClick={() => handleNavClick('/dashboard')}
								className='w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-200 transition-colors flex items-center gap-3 hover:text-white'
							>
								<FaHome className='w-6 h-6' /> Главная
							</button>
						</li>
						<li>
							<button
								onClick={() => handleNavClick('/add-expense')}
								className='w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-200 transition-colors flex items-center gap-3 hover:text-white'
							>
								<FaMinus className='w-6 h-6' /> Ваши расходы
							</button>
						</li>
						<li>
							<button
								onClick={() => handleNavClick('/add-income')}
								className='w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-200 transition-colors flex items-center gap-3 hover:text-white'
							>
								<FaPlus className='w-6 h-6' /> Ваши доходы
							</button>
						</li>
						<li>
							<button
								onClick={() => handleNavClick('/add-instant-expense')}
								className='w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-200 transition-colors flex items-center gap-3 hover:text-white'
							>
								<FaShoppingCart className='w-6 h-6' /> Неожиданные расходы
							</button>
						</li>
						<li>
							<button
								onClick={() => handleNavClick('/add-financial-operation')}
								className='w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-200 transition-colors flex items-center gap-3 hover:text-white'
							>
								<FaMoneyBillWave className='w-6 h-6' /> Денежные операции
							</button>
						</li>
						<li>
							<button
								onClick={() => handleNavClick('/courses')}
								className='w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-200 transition-colors flex items-center gap-3 hover:text-white'
							>
								<FaBook className='w-6 h-6' /> Курсы финансовой грамотности
							</button>
						</li>
					</ul>
				</nav>
				<div
					className='p-4 bg-gray-900'
					style={{ position: 'absolute', bottom: 0, width: '100%' }}
				>
					<button
						onClick={() => handleNavClick('/settings')}
						className='w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-3 justify-center'
					>
						<FaCog className='w-6 h-6' /> Настройки
					</button>
				</div>
			</div>
			{isOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
};

export default Sidebar;
