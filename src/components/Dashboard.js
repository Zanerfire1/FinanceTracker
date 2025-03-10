import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from 'chart.js';
import {
	FaWallet,
	FaDollarSign,
	FaShoppingCart,
	FaBitcoin,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale
);

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [expenses, setExpenses] = useState([]);
	const [incomes, setIncomes] = useState([]);
	const [instantExpenses, setInstantExpenses] = useState([]);
	const [financialOperations, setFinancialOperations] = useState([]);
	const [categories, setCategories] = useState({});
	const [currency, setCurrency] = useState(null);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [loadingIncomes, setLoadingIncomes] = useState(false);
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [categoriesLoaded, setCategoriesLoaded] = useState(false);
	const [subscription, setSubscription] = useState(null);
	const [showNotification, setShowNotification] = useState(false);
	const [userParameters, setUserParameters] = useState(null);
	const [savingsMessage, setSavingsMessage] = useState(null);
	const [entertainmentWarning, setEntertainmentWarning] = useState(null);
	const [cryptoData, setCryptoData] = useState([]);
	const [loadingCrypto, setLoadingCrypto] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));
		if (!storedUserData) {
			navigate('/login');
			return;
		}
		setUser(storedUserData);

		const handleStorageChange = e => {
			if (e.key === 'userData') {
				const newUserData = JSON.parse(e.newValue);
				if (newUserData) setUser(newUserData);
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [navigate]);

	useEffect(() => {
		if (!user?.userId) return;

		const fetchAllData = async () => {
			try {
				await Promise.all([
					fetchExpenses(),
					fetchIncomes(),
					fetchInstantExpenses(),
					fetchFinancialOperations(),
					fetchSubscriptions(),
					fetchUserParameters(),
					fetchCryptoData(),
				]);
				setIsDataLoaded(true);
			} catch (error) {}
		};

		fetchAllData();
	}, [user]);

	useEffect(() => {
		if (isDataLoaded && !categoriesLoaded) {
			fetchCategories();
			setCategoriesLoaded(true);
		}
	}, [isDataLoaded, categoriesLoaded]);

	useEffect(() => {
		if (user?.currencyId) {
			fetch(`${API_BASE_URL}/currency/${user.currencyId}`)
				.then(response => response.json())
				.then(data => setCurrency(data))
				.catch(error => {});
		}
	}, [user?.currencyId]);

	useEffect(() => {
		if (!subscription) {
			const baseInterval = 2 * 60 * 60 * 1000;
			const randomOffset = (Math.random() * 2 - 1) * 60 * 60 * 1000;
			const intervalDuration = baseInterval + randomOffset;
			const interval = setInterval(
				() => setShowNotification(true),
				intervalDuration
			);
			return () => clearInterval(interval);
		}
	}, [subscription]);

	useEffect(() => {
		if (isDataLoaded && userParameters) calculateFinancialInsights();
	}, [
		isDataLoaded,
		userParameters,
		expenses,
		incomes,
		instantExpenses,
		financialOperations,
	]);

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
		} catch (error) {
			setSubscription(null);
		}
	};

	const fetchUserParameters = async () => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/user/${user.userId}/parameters`
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			setUserParameters(data);
		} catch (error) {
			setUserParameters(null);
		}
	};

	const fetchExpenses = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/expenses/${user.userId}`);
			if (!response.ok) throw new Error();
			const data = await response.json();
			setExpenses(data);
		} catch (error) {}
	};

	const fetchIncomes = async () => {
		setLoadingIncomes(true);
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);
			const response = await fetch(`${API_BASE_URL}/incomes/${user.userId}`, {
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			if (!response.ok) throw new Error();
			const data = await response.json();
			setIncomes(data);
		} catch (error) {
			setIncomes([]);
		} finally {
			setLoadingIncomes(false);
		}
	};

	const fetchInstantExpenses = async () => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/instant-expenses/${user.userId}`
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			setInstantExpenses(data);
		} catch (error) {}
	};

	const fetchFinancialOperations = async () => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/financial-operations/${user.userId}`
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			setFinancialOperations(data);
		} catch (error) {}
	};

	const fetchCategories = async () => {
		if (loadingCategories || categoriesLoaded) return;
		setLoadingCategories(true);
		const allCategoryIds = [
			...new Set(
				[
					...expenses.map(expense => Number(expense.categoryId)),
					...incomes.map(income => Number(income.operationCategoryId)),
					...instantExpenses.map(expense => Number(expense.categoryId)),
					...financialOperations.map(operation => Number(operation.categoryId)),
				].filter(id => !isNaN(id) && id !== null && id !== undefined)
			),
		];
		const categoryData = {};

		if (allCategoryIds.length === 0) {
			setCategories({});
			setLoadingCategories(false);
			return;
		}

		try {
			const token = localStorage.getItem('token');
			for (const categoryId of allCategoryIds) {
				const response = await fetch(
					`${API_BASE_URL}/operation-categories/${categoryId}`,
					{ headers: token ? { Authorization: `Bearer ${token}` } : {} }
				);
				if (response.ok) {
					const category = await response.json();
					categoryData[categoryId] =
						category.categoryName || category.name || 'Без категории';
				} else {
					categoryData[categoryId] = 'Без категории';
				}
			}
			setCategories(categoryData);
		} catch (error) {
			const fallbackCategories = {};
			allCategoryIds.forEach(id => (fallbackCategories[id] = 'Без категории'));
			setCategories(fallbackCategories);
		} finally {
			setLoadingCategories(false);
		}
	};

	const fetchCryptoData = async () => {
		setLoadingCrypto(true);
		try {
			const response = await fetch(
				'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false'
			);
			if (!response.ok) throw new Error();
			const data = await response.json();
			setCryptoData(data);
		} catch (error) {
			setCryptoData([]);
		} finally {
			setLoadingCrypto(false);
		}
	};

	const calculateFinancialInsights = () => {
		if (!userParameters) return;

		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getYear();

		const monthlyIncome = incomes
			.filter(income => {
				const date = new Date(income.startDate || income.operationDate);
				return (
					date.getMonth() === currentMonth && date.getYear() === currentYear
				);
			})
			.reduce((sum, income) => sum + (income.amount || 0), 0);

		const monthlyExpenses = [
			...expenses,
			...instantExpenses,
			...financialOperations,
		]
			.filter(item => {
				const date = new Date(
					item.startDate || item.purchaseDate || item.operationDate
				);
				return (
					date.getMonth() === currentMonth && date.getYear() === currentYear
				);
			})
			.reduce((sum, item) => sum + (item.amount || 0), 0);

		const savings = monthlyIncome - monthlyExpenses;

		if (
			savings > 0 &&
			userParameters.maxSavingsGoal &&
			savings >= userParameters.maxSavingsGoal * 0.8
		) {
			setSavingsMessage(
				`Поздравляем! Вы накопили ${savings.toFixed(2)} ${
					currency?.currencyCode
				} за этот месяц!`
			);
		} else {
			setSavingsMessage(null);
		}

		const entertainmentCategory = Object.keys(categories).find(
			key => categories[key].toLowerCase() === 'развлечения'
		);
		const entertainmentSpending = [
			...expenses,
			...instantExpenses,
			...financialOperations,
		]
			.filter(item => {
				const date = new Date(
					item.startDate || item.purchaseDate || item.operationDate
				);
				const isEntertainment = item.categoryId === entertainmentCategory;
				return (
					date.getMonth() === currentMonth &&
					date.getYear() === currentYear &&
					isEntertainment
				);
			})
			.reduce((sum, item) => sum + (item.amount || 0), 0);

		if (
			userParameters.maxEntertainmentSpending &&
			entertainmentSpending > userParameters.maxEntertainmentSpending
		) {
			setEntertainmentWarning(
				`Вы потратили слишком много на развлечения! ${entertainmentSpending.toFixed(
					2
				)} ${currency?.currencyCode} превышает лимит в ${
					userParameters.maxEntertainmentSpending
				} ${currency?.currencyCode}.`
			);
		} else {
			setEntertainmentWarning(null);
		}
	};

	const incomeByCategoryData = {
		labels: incomes.map(income => income.categoryName || 'Без категории'),
		datasets: [
			{
				data: incomes.map(income => income.amount || 0),
				backgroundColor: [
					'#4B5EAA',
					'#6B7280',
					'#3B82F6',
					'#9CA3AF',
					'#1E3A8A',
					'#D1D5DB',
				],
				borderWidth: 0,
				hoverOffset: 4,
			},
		],
	};

	const statsData = {
		labels: ['Доходы', 'Расходы', 'Разовые расходы', 'Операции'],
		datasets: [
			{
				label: 'Сумма',
				data: [
					incomes.reduce((sum, income) => sum + (income.amount || 0), 0),
					expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0),
					instantExpenses.reduce(
						(sum, expense) => sum + (expense.amount || 0),
						0
					),
					financialOperations.reduce((sum, op) => sum + (op.amount || 0), 0),
				],
				backgroundColor: '#4B5EAA',
				borderColor: '#3B82F6',
				borderWidth: 1,
				hoverBackgroundColor: '#6B7280',
			},
		],
	};

	const cryptoChartData = {
		labels: cryptoData.map(coin => coin.name),
		datasets: [
			{
				label: 'Цена (USD)',
				data: cryptoData.map(coin => coin.current_price),
				backgroundColor: '#F59E0B',
				borderColor: '#D97706',
				borderWidth: 1,
				hoverBackgroundColor: '#FBBF24',
			},
		],
	};

	if (!user) return null;

	return (
		<div className='p-6 bg-gray-900 text-gray-200 relative'>
			{showNotification && !subscription && (
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -50 }}
					className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 border border-purple-500 rounded-lg shadow-lg p-4 flex items-center gap-4 max-w-md w-full'
				>
					<div className='flex-1'>
						<p className='text-gray-200'>
							Откройте новые возможности с Премиум подпиской всего за
							$1.99/месяц!
						</p>
						<motion.button
							whileHover={{ backgroundColor: '#9333ea' }}
							whileTap={{ scale: 0.95 }}
							onClick={() => {
								setShowNotification(false);
								navigate('/subscribe');
							}}
							className='mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all duration-300'
						>
							Приобрести подписку
						</motion.button>
					</div>
					<button
						onClick={() => setShowNotification(false)}
						className='text-gray-400 hover:text-gray-200'
					>
						✕
					</button>
				</motion.div>
			)}

			<h2 className='text-2xl font-semibold text-white mb-6'>Обзор</h2>

			{(savingsMessage || entertainmentWarning) && (
				<div className='mb-6 p-4 bg-gray-800 rounded-lg border border-yellow-500'>
					{savingsMessage && <p className='text-green-400'>{savingsMessage}</p>}
					{entertainmentWarning && (
						<p className='text-red-400'>{entertainmentWarning}</p>
					)}
				</div>
			)}

			<div className='mb-8'>
				<h3 className='text-xl font-medium text-gray-300 mb-4'>
					Общая статистика
				</h3>
				{loadingIncomes ? (
					<p className='text-gray-500'>Загрузка...</p>
				) : (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<div className='p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 h-[400px]'>
							<Bar
								data={statsData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: { display: false },
										tooltip: {
											backgroundColor: '#4B5EAA',
											bodyColor: '#FFFFFF',
										},
									},
									scales: {
										x: { ticks: { color: '#9CA3AF' } },
										y: { ticks: { color: '#9CA3AF' } },
									},
								}}
							/>
						</div>
						<div className='p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 h-[400px]'>
							<h1 className='text-white'>Статистика доходов по категориям</h1>
							<Doughnut
								data={incomeByCategoryData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: 'top',
											labels: { color: '#9CA3AF', font: { size: 14 } },
										},
										tooltip: {
											backgroundColor: '#3B82F6',
											bodyColor: '#FFFFFF',
											titleFont: { size: 14 },
											bodyFont: { size: 12 },
										},
									},
									layout: {
										padding: { top: 20, bottom: 20, left: 20, right: 20 },
									},
								}}
							/>
						</div>
					</div>
				)}
			</div>

			<div className='mb-8'>
				<h3 className='text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2'>
					<FaBitcoin className='text-yellow-400 w-6 h-6' /> Статистика
					криптовалют
				</h3>
				{loadingCrypto ? (
					<p className='text-gray-500'>Загрузка крипто-данных...</p>
				) : cryptoData.length > 0 ? (
					<div className='grid grid-cols-1 gap-6'>
						<div className='p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700'>
							<table className='w-full text-left'>
								<thead>
									<tr className='border-b border-gray-700'>
										<th className='py-2 text-gray-300'>Название</th>
										<th className='py-2 text-gray-300'>Цена (USD)</th>
										<th className='py-2 text-gray-300'>Изменение за 24ч</th>
										<th className='py-2 text-gray-300'>Капитализация</th>
									</tr>
								</thead>
								<tbody>
									{cryptoData.map(coin => (
										<tr key={coin.id} className='border-b border-gray-700'>
											<td className='py-2 flex items-center gap-2'>
												<img
													src={coin.image}
													alt={coin.name}
													className='w-6 h-6'
												/>
												{coin.name}
											</td>
											<td className='py-2'>
												${coin.current_price.toLocaleString()}
											</td>
											<td
												className={`py-2 ${
													coin.price_change_percentage_24h >= 0
														? 'text-green-400'
														: 'text-red-400'
												}`}
											>
												{coin.price_change_percentage_24h.toFixed(2)}%
											</td>
											<td className='py-2'>
												${coin.market_cap.toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div className='p-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700 text-center'>
						<p className='text-gray-400'>Нет данных о криптовалютах.</p>
					</div>
				)}
			</div>

			<div className='mb-8'>
				<h3 className='text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2'>
					<FaWallet className='text-purple-400 w-6 h-6' /> Постоянные расходы
				</h3>
				{expenses.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{expenses.map(expense => (
							<div
								key={expense.id}
								className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300'
							>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-3 bg-purple-500/10 rounded-lg'>
										<FaDollarSign className='text-purple-400 w-6 h-6' />
									</div>
									<h4 className='font-semibold text-gray-100 text-lg'>
										{expense.description}
									</h4>
								</div>
								<div className='space-y-3'>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Сумма:</p>
										<p className='text-gray-100 font-medium'>
											{expense.amount} {currency?.currencyCode || ''}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Дата начала:</p>
										<p className='text-gray-100'>
											{new Date(expense.startDate).toLocaleDateString()}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Дата окончания:</p>
										<p className='text-gray-100'>
											{new Date(expense.endDate).toLocaleDateString()}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Частота:</p>
										<p className='text-gray-100 capitalize'>
											{expense.frequency}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Категория:</p>
										<p className='text-gray-100'>
											{categories[expense.categoryId] || 'Не указано'}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Повторений:</p>
										<p className='text-gray-100'>{expense.repeatCount}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='p-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700 text-center'>
						<p className='text-gray-400'>Нет постоянных расходов.</p>
					</div>
				)}
			</div>

			<div className='mb-8'>
				<h3 className='text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2'>
					<FaWallet className='text-green-400 w-6 h-6' /> Доходы
				</h3>
				{loadingIncomes ? (
					<p className='text-gray-500'>Загрузка...</p>
				) : incomes.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{incomes.map(income => (
							<div
								key={income.id}
								className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500 transition-all duration-300'
							>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-3 bg-green-500/10 rounded-lg'>
										<FaDollarSign className='text-green-400 w-6 h-6' />
									</div>
									<h4 className='font-semibold text-gray-100 text-lg'>
										{income.description}
									</h4>
								</div>
								<div className='space-y-3'>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Сумма:</p>
										<p className='text-gray-100 font-medium'>
											{income.amount} {currency?.currencyCode || ''}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Дата начала:</p>
										<p className='text-gray-100'>
											{new Date(income.startDate).toLocaleDateString()}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Дата окончания:</p>
										<p className='text-gray-100'>
											{new Date(income.endDate).toLocaleDateString()}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Частота:</p>
										<p className='text-gray-100 capitalize'>
											{income.frequency}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Категория:</p>
										<p className='text-gray-100'>
											{income.categoryName || 'Не указано'}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Повторений:</p>
										<p className='text-gray-100'>{income.repeatCount}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='p-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700 text-center'>
						<p className='text-gray-400'>Нет доходов.</p>
					</div>
				)}
			</div>

			<div className='mb-8'>
				<h3 className='text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2'>
					<FaWallet className='text-red-400 w-6 h-6' /> Разовые расходы
				</h3>
				{instantExpenses.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{instantExpenses.map(expense => (
							<div
								key={expense.id}
								className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:border-red-500 transition-all duration-300'
							>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-3 bg-red-500/10 rounded-lg'>
										<FaShoppingCart className='text-red-400 w-6 h-6' />
									</div>
									<h4 className='font-semibold text-gray-100 text-lg'>
										{expense.description}
									</h4>
								</div>
								<div className='space-y-3'>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Сумма:</p>
										<p className='text-gray-100 font-medium'>
											{expense.amount} {currency?.currencyCode || ''}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Дата покупки:</p>
										<p className='text-gray-100'>
											{new Date(expense.purchaseDate).toLocaleDateString()}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Магазин:</p>
										<p className='text-gray-100'>{expense.shopName}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='p-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700 text-center'>
						<p className='text-gray-400'>Нет разовых расходов.</p>
					</div>
				)}
			</div>

			<div className='mb-8'>
				<h3 className='text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2'>
					<FaWallet className='text-purple-400 w-6 h-6' /> Финансовые операции
				</h3>
				{financialOperations.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{financialOperations.map(operation => (
							<div
								key={operation.id}
								className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300'
							>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-3 bg-purple-500/10 rounded-lg'>
										<FaDollarSign className='text-purple-400 w-6 h-6' />
									</div>
									<h4 className='font-semibold text-gray-100 text-lg'>
										{operation.operationName}
									</h4>
								</div>
								<div className='space-y-3'>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Сумма:</p>
										<p className='text-gray-100 font-medium'>
											{operation.amount} {currency?.currencyCode || ''}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Описание:</p>
										<p className='text-gray-100'>{operation.description}</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Тип:</p>
										<p className='text-gray-100 capitalize'>
											{operation.operationType}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Дата:</p>
										<p className='text-gray-100'>
											{new Date(operation.operationDate).toLocaleDateString()}
										</p>
									</div>
									<div className='flex justify-between items-center'>
										<p className='text-gray-400'>Категория:</p>
										<p className='text-gray-100'>
											{operation.categoryName || 'Не указано'}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='p-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700 text-center'>
						<p className='text-gray-400'>Нет финансовых операций.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
