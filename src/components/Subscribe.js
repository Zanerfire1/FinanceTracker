import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { FaCreditCard, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Subscribe = () => {
	const [user, setUser] = useState(null);
	const [subscription, setSubscription] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	let isMounted = true;

	useEffect(() => {
		const storedUser = localStorage.getItem('userData');
		if (storedUser) setUser(JSON.parse(storedUser));
		else navigate('/login');
		return () => {
			isMounted = false;
		};
	}, [navigate]);

	useEffect(() => {
		if (!user || !user.userId) {
			setLoading(false);
			return;
		}
		const fetchInitialData = async () => {
			try {
				await fetchSubscriptions();
			} catch {
				setSubscription(null);
			} finally {
				if (isMounted) setLoading(false);
			}
		};
		fetchInitialData();
	}, [user]);

	const fetchSubscriptions = async () => {
		try {
			if (!user?.userId) return;
			const response = await fetch(
				`${API_BASE_URL}/courses/paid-subscribers?userId=${user.userId}`
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			if (isMounted) {
				const activeSubscription = data.find(
					sub => new Date(sub.subscriptionEndDate) > new Date()
				);
				setSubscription(activeSubscription || null);
			}
		} catch {
			if (isMounted) setSubscription(null);
		}
	};

	const handleSubscribe = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`${API_BASE_URL}/courses/subscribe?userId=${user.userId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				}
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			alert(data.message);
			setShowModal(false);
			navigate('/dashboard');
		} catch {
			alert('Не удалось оформить подписку');
		} finally {
			if (isMounted) setLoading(false);
		}
	};

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	if (loading)
		return <div className='text-gray-200 text-center p-6'>Загрузка...</div>;
	if (!user) return null;

	return (
		<div className='bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: 1,
					y: 0,
					transition: { duration: 0.5, ease: 'easeOut' },
				}}
				className='max-w-xl w-full text-center'
			>
				<h2 className='text-3xl font-bold text-white mb-6'>Премиум подписка</h2>
				{subscription ? (
					<div>
						<div className='flex items-center justify-center mb-4'>
							<FaCheck className='text-green-500 w-12 h-12' />
						</div>
						<p className='text-xl font-semibold text-green-400 mb-2'>
							Поздравляем! Вы уже оформили подписку.
						</p>
						<p className='text-gray-300 mb-4'>
							Ваша подписка активна до{' '}
							<span className='text-white font-medium'>
								{new Date(
									subscription.subscriptionEndDate
								).toLocaleDateString()}
							</span>
						</p>
						<p className='text-gray-400 mb-6'>
							Наслаждайтесь всеми преимуществами Премиум плана
						</p>
						<motion.button
							whileHover={{ backgroundColor: '#4b5e7d' }}
							whileTap={{ scale: 0.95 }}
							onClick={() => navigate('/dashboard')}
							className='px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
						>
							Перейти на Главную
						</motion.button>
					</div>
				) : (
					<div>
						<p className='text-gray-200 mb-6'>
							Подпишитесь на Премиум план и получите доступ к эксклюзивным
							возможностям
						</p>
						<ul className='space-y-4 text-gray-100 mb-8 text-left mx-auto max-w-md'>
							<li className='flex items-center'>
								<FaCheck className='text-green-500 mr-3' />
								<span>Все функции бесплатного плана</span>
							</li>
							<li className='flex items-center'>
								<FaCheck className='text-green-500 mr-3' />
								<span>Расширенная аналитика и прогнозы</span>
							</li>
							<li className='flex items-center'>
								<FaCheck className='text-green-500 mr-3' />
								<span>Эксклюзивные видеоролики</span>
							</li>
							<li className='flex items-center'>
								<FaCheck className='text-green-500 mr-3' />
								<span>Персонализированные финансовые советы</span>
							</li>
						</ul>
						<p className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4'>
							$1.99/месяц
						</p>
						<p className='text-gray-400 mb-6'>Срок действия: 1 месяц</p>
						<motion.button
							whileHover={{ backgroundColor: '#9333ea' }}
							whileTap={{ scale: 0.95 }}
							onClick={openModal}
							className='w-full max-w-xs mx-auto py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all duration-300'
						>
							Оформить подписку
						</motion.button>
					</div>
				)}
			</motion.div>
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
					<div className='w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700'>
						<h2 className='text-3xl font-bold text-white mb-6 text-center'>
							Подтверждение подписки
						</h2>
						<div className='space-y-6'>
							<div>
								<p className='text-gray-300'>
									Вы оформляете подписку на{' '}
									<span className='text-white font-medium'>Премиум план</span>
								</p>
								<p className='text-gray-300'>
									Стоимость:{' '}
									<span className='text-white font-medium'>$1.99/месяц</span>
								</p>
								<p className='text-gray-300'>Срок действия: 1 месяц</p>
								<p className='text-gray-400 text-sm mt-2'>
									Нажимая "Подтвердить", вы соглашаетесь с{' '}
									<a href='/terms' className='text-blue-400 hover:underline'>
										условиями использования
									</a>{' '}
									и{' '}
									<a href='/privacy' className='text-blue-400 hover:underline'>
										политикой конфиденциальности
									</a>
									.
								</p>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Номер карты
								</label>
								<input
									type='text'
									placeholder='1234 5678 9012 3456'
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 mb-4'
									disabled
								/>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Срок действия
								</label>
								<input
									type='text'
									placeholder='MM/YY'
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 mb-4'
									disabled
								/>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									CVV
								</label>
								<input
									type='text'
									placeholder='123'
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 mb-4'
									disabled
								/>
							</div>
							<div className='flex gap-4'>
								<button
									onClick={handleSubscribe}
									disabled={loading}
									className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2'
								>
									{loading ? (
										'Обработка...'
									) : (
										<>
											<FaCreditCard className='w-5 h-5' /> Подтвердить
										</>
									)}
								</button>
								<button
									type='button'
									onClick={closeModal}
									className='w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
								>
									Отмена
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Subscribe;
