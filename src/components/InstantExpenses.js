import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { FaWallet, FaShoppingCart, FaPlus } from 'react-icons/fa';

const InstantExpenses = () => {
	const [newExpense, setNewExpense] = useState({
		shopName: '',
		purchaseDate: '',
		amount: '',
		description: '',
	});
	const [user, setUser] = useState(null);
	const [instantExpenses, setInstantExpenses] = useState([]);
	const [currency, setCurrency] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	let isMounted = true;

	useEffect(() => {
		const storedUser = localStorage.getItem('userData');
		if (storedUser) {
			const userData = JSON.parse(storedUser);
			setUser(userData);
		} else {
			navigate('/login');
		}

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
				if (user.currencyId && !currency) {
					const currencyResponse = await fetch(
						`${API_BASE_URL}/currency/${user.currencyId}`
					);
					if (currencyResponse.ok) {
						const currencyData = await currencyResponse.json();
						if (isMounted) {
							setCurrency(currencyData);
						}
					}
				}

				await fetchInstantExpenses();
			} catch (error) {
				console.error(error);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchInitialData();
	}, [user]);

	const fetchInstantExpenses = async () => {
		try {
			if (!user?.userId) return;
			const response = await fetch(
				`${API_BASE_URL}/instant-expenses/${user.userId}`
			);
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const data = await response.json();
			if (isMounted) {
				setInstantExpenses(data);
			}
		} catch (error) {
			console.error(error);
			if (isMounted) {
				setInstantExpenses([]);
			}
		}
	};

	const fetchFreshUserData = async () => {
		try {
			setLoading(true);
			const userId = user?.userId;
			if (!userId) {
				navigate('/login');
				return null;
			}

			const userResponse = await fetch(`${API_BASE_URL}/user/${userId}`);
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data');
			}
			const freshUserData = await userResponse.json();

			const updatedUserData = { ...user };
			if (freshUserData.username && freshUserData.username !== user.username) {
				updatedUserData.username = freshUserData.username;
			}
			if (freshUserData.email && freshUserData.email !== user.email) {
				updatedUserData.email = freshUserData.email;
			}
			if (
				freshUserData.currentBalance !== undefined &&
				freshUserData.currentBalance !== user.currentBalance
			) {
				updatedUserData.currentBalance = freshUserData.currentBalance;
			}
			if (
				freshUserData.createdAt &&
				freshUserData.createdAt !== user.createdAt
			) {
				updatedUserData.createdAt = freshUserData.createdAt;
			}
			if (
				freshUserData.lastLogin &&
				freshUserData.lastLogin !== user.lastLogin
			) {
				updatedUserData.lastLogin = freshUserData.lastLogin;
			}
			if (
				freshUserData.currencyId &&
				freshUserData.currencyId !== user.currencyId
			) {
				updatedUserData.currencyId = freshUserData.currencyId;
			}
			if (freshUserData.imageUrl && freshUserData.imageUrl !== user.imageUrl) {
				updatedUserData.imageUrl = freshUserData.imageUrl;
			}
			if (freshUserData.id && freshUserData.id !== user.id) {
				updatedUserData.id = freshUserData.id;
			}
			if (
				freshUserData.passwordHash !== undefined &&
				freshUserData.passwordHash !== user.passwordHash
			) {
				updatedUserData.passwordHash = freshUserData.passwordHash;
			}

			localStorage.setItem('userData', JSON.stringify(updatedUserData));
			if (isMounted) {
				setUser(updatedUserData);
			}
			return updatedUserData;
		} catch (error) {
			console.error(error);
			return null;
		} finally {
			if (isMounted) {
				setLoading(false);
			}
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		if (
			!newExpense.shopName ||
			!newExpense.purchaseDate ||
			!newExpense.amount ||
			!newExpense.description
		) {
			alert('Please fill all required fields.');
			return;
		}

		const expenseData = {
			userId: user?.userId,
			shopName: newExpense.shopName,
			purchaseDate: newExpense.purchaseDate,
			amount: parseFloat(newExpense.amount),
			description: newExpense.description,
		};

		try {
			const response = await fetch(`${API_BASE_URL}/instant-expenses`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(expenseData),
			});

			if (!response.ok) {
				throw new Error('Failed to add expense');
			}

			await fetchFreshUserData();
			await fetchInstantExpenses();

			setNewExpense({
				shopName: '',
				purchaseDate: '',
				amount: '',
				description: '',
			});
			setShowModal(false);
		} catch (error) {
			console.error(error);
			alert('Failed to add expense. Please try again.');
		}
	};

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	if (loading)
		return <div className='text-gray-200 text-center p-6'>Loading...</div>;
	if (!user) return null;

	return (
		<div className='p-6 bg-gray-900 text-gray-200 min-h-screen'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-semibold text-white'>Разовые расходы</h2>
				<button
					onClick={openModal}
					className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
				>
					<FaPlus className='w-5 h-5' /> Добавить расход
				</button>
			</div>

			<div className='mb-8'>
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

			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
					<div className='w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700'>
						<h2 className='text-3xl font-bold text-white mb-6 text-center'>
							Добавить разовый расход
						</h2>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div>
								<label
									htmlFor='shopName'
									className='block text-sm font-medium text-gray-300 mb-2'
								>
									Магазин
								</label>
								<input
									type='text'
									id='shopName'
									placeholder='Введите название магазина'
									value={newExpense.shopName}
									onChange={e =>
										setNewExpense({ ...newExpense, shopName: e.target.value })
									}
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='purchaseDate'
									className='block text-sm font-medium text-gray-300 mb-2'
								>
									Дата покупки
								</label>
								<input
									type='date'
									id='purchaseDate'
									value={newExpense.purchaseDate}
									onChange={e =>
										setNewExpense({
											...newExpense,
											purchaseDate: e.target.value,
										})
									}
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='amount'
									className='block text-sm font-medium text-gray-300 mb-2'
								>
									Сумма
								</label>
								<input
									type='number'
									id='amount'
									placeholder='Введите сумму'
									value={newExpense.amount}
									onChange={e =>
										setNewExpense({ ...newExpense, amount: e.target.value })
									}
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
									step='0.01'
									min='0'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='description'
									className='block text-sm font-medium text-gray-300 mb-2'
								>
									Описание
								</label>
								<input
									type='text'
									id='description'
									placeholder='Введите описание'
									value={newExpense.description}
									onChange={e =>
										setNewExpense({
											...newExpense,
											description: e.target.value,
										})
									}
									className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
									required
								/>
							</div>

							<div className='flex gap-4'>
								<button
									type='submit'
									disabled={loading}
									className='w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
								>
									{loading ? 'Добавляем...' : 'Добавить расход'}
								</button>
								<button
									type='button'
									onClick={closeModal}
									className='w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
								>
									Отмена
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default InstantExpenses;
