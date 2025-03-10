import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const Profile = () => {
	const [user, setUser] = useState(null);
	const [currency, setCurrency] = useState(null);
	const [subscription, setSubscription] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
	const navigate = useNavigate();
	const { logout, userParameters } = useAuthStore();

	useEffect(() => {
		const userId = JSON.parse(localStorage.getItem('userData'))?.userId;
		if (!userId) {
			navigate('/login');
			return;
		}

		const fetchUserProfile = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/user/${userId}`);
				if (!response.ok) throw new Error('Не удалось загрузить профиль');
				const data = await response.json();
				setUser(data);

				await fetchSubscriptions(userId);

				const currencyId =
					userParameters?.currencyId ||
					data.userCurrencies?.[0]?.currencyId ||
					JSON.parse(localStorage.getItem('userData'))?.currencyId;
				if (currencyId) {
					const currencyResponse = await fetch(
						`${API_BASE_URL}/currency/${currencyId}`
					);
					setCurrency(
						currencyResponse.ok
							? await currencyResponse.json()
							: { currencyCode: 'Загрузка...' }
					);
				} else {
					setCurrency({ currencyCode: 'Загрузка...' });
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();

		const handleStorageChange = e => {
			if (e.key === 'userData' || e.key === 'userParameters')
				fetchUserProfile();
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [navigate, userParameters?.currencyId]);

	const fetchSubscriptions = async userId => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/courses/paid-subscribers?userId=${userId}`
			);
			if (!response.ok) throw new Error('Не удалось загрузить подписки');
			const data = await response.json();
			setSubscription(
				data.find(sub => new Date(sub.subscriptionEndDate) > new Date()) || null
			);
		} catch (error) {
			setSubscription(null);
		}
	};

	const handleLogoutClick = () => setIsLogoutConfirmOpen(true);

	const handleConfirmLogout = () => {
		localStorage.removeItem('userData');
		localStorage.removeItem('userParameters');
		setUser(null);
		logout();
		setIsLogoutConfirmOpen(false);
		navigate('/');
	};

	const handleCancelLogout = () => setIsLogoutConfirmOpen(false);

	const handleSubscribeClick = () => navigate('/subscribe');

	const handleEditProfile = () => navigate('/settings');

	if (loading)
		return <div className='text-gray-200 text-center p-6'>Загрузка...</div>;
	if (error) return <div className='text-red-500 text-center p-6'>{error}</div>;
	if (!user)
		return (
			<div className='text-gray-200 text-center p-6'>
				Пользователь не найден
			</div>
		);

	const avatarUrl = user.imageUrl
		? `${API_BASE_URL.replace('/api', '')}/${user.imageUrl}`
		: '/images/avatar_placeholder.png';

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
		exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
	};

	return (
		<div className='min-h-screen bg-gray-900 text-gray-200 p-6'>
			<div className='max-w-4xl mx-auto'>
				<h2 className='text-3xl font-bold text-white mb-8 text-center'>
					Профиль
				</h2>
				<div className='bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700'>
					<div className='flex flex-col items-center mb-6'>
						<motion.img
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.2 }}
							src={avatarUrl}
							alt={user.username}
							className='w-32 h-32 rounded-full mb-4 border-2 border-gray-600 shadow-md object-cover'
						/>
						<div className='flex items-center gap-2'>
							<h3 className='text-2xl font-semibold text-white'>
								{user.username}
							</h3>
							{subscription && <FaCheck className='text-green-500 w-6 h-6' />}
						</div>
						<p className='text-sm text-gray-400 mt-2'>
							{subscription
								? `Подписка активна до ${new Date(
										subscription.subscriptionEndDate
								  ).toLocaleDateString()}`
								: 'Подписка отсутствует'}
						</p>
					</div>
					<div className='space-y-4'>
						<div className='flex justify-between'>
							<p className='text-gray-400'>Email:</p>
							<p className='text-gray-200'>{user.email}</p>
						</div>
						<div className='flex justify-between'>
							<p className='text-gray-400'>Баланс:</p>
							<p className='text-gray-200'>
								{user.currentBalance.toLocaleString()}{' '}
								{currency?.currencyCode || 'Загрузка...'}
							</p>
						</div>
						<div className='flex justify-between'>
							<p className='text-gray-400'>Дата регистрации:</p>
							<p className='text-gray-200'>
								{new Date(user.createdAt).toLocaleDateString()}
							</p>
						</div>
						<div className='flex justify-between'>
							<p className='text-gray-400'>Последний вход:</p>
							<p className='text-gray-200'>
								{new Date(user.lastLogin).toLocaleDateString()}
							</p>
						</div>
					</div>
					<div className='mt-8 text-center'>
						<div className='flex gap-4 justify-center flex-wrap'>
							<button
								onClick={handleEditProfile}
								className='py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
							>
								Редактировать профиль
							</button>
							{!subscription && (
								<motion.button
									whileHover={{ backgroundColor: '#9333ea' }}
									whileTap={{ opacity: 0.9 }}
									onClick={handleSubscribeClick}
									className='py-3 px-6 bg-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all duration-300'
								>
									Приобрести подписку
								</motion.button>
							)}
							<button
								onClick={handleLogoutClick}
								className='py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
							>
								Выход
							</button>
						</div>
					</div>
				</div>
			</div>
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
	);
};

export default Profile;
