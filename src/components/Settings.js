import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
	const [user, setUser] = useState(null);
	const [userParameters, setUserParameters] = useState(null);
	const [currencies, setCurrencies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sectionErrors, setSectionErrors] = useState({
		profile: null,
		contact: null,
		password: null,
		avatar: null,
		parameters: null,
	});
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		newPassword: '',
		oldPassword: '',
		imageFile: null,
	});
	const [parametersFormData, setParametersFormData] = useState({
		currencyId: '',
		maxMonthlySpending: '',
		maxEntertainmentSpending: '',
		maxSavingsGoal: '',
	});
	const [imagePreview, setImagePreview] = useState(null);
	const [sectionsOpen, setSectionsOpen] = useState({
		profile: false,
		contact: false,
		password: false,
		avatar: true,
		parameters: false,
	});
	const [successMessage, setSuccessMessage] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));
		if (!storedUserData?.userId) {
			navigate('/login');
			return;
		}
		setUser(storedUserData);

		const fetchUserParameters = async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/user/${storedUserData.userId}/parameters`
				);
				if (!response.ok) throw new Error('Не удалось загрузить параметры');
				const data = await response.json();
				setUserParameters(data);
				setParametersFormData({
					currencyId: data.currencyId || '',
					maxMonthlySpending: data.maxMonthlySpending || '',
					maxEntertainmentSpending: data.maxEntertainmentSpending || '',
					maxSavingsGoal: data.maxSavingsGoal || '',
				});
				localStorage.setItem('userParameters', JSON.stringify(data));
			} catch (err) {
				setSectionErrors(prev => ({ ...prev, parameters: err.message }));
			}
		};

		const fetchCurrencies = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/currency/all`);
				if (!response.ok) throw new Error('Не удалось загрузить валюты');
				const data = await response.json();
				setCurrencies(data);
			} catch (err) {
				setSectionErrors(prev => ({ ...prev, parameters: err.message }));
			}
		};

		const loadData = async () => {
			await Promise.all([fetchUserParameters(), fetchCurrencies()]);
			setLoading(false);
		};

		loadData();

		const handleStorageChange = e => {
			if (e.key === 'userData') {
				const newUserData = JSON.parse(e.newValue);
				if (newUserData) {
					setUser(newUserData);
					setFormData({
						username: newUserData.username || '',
						email: newUserData.email || '',
						password: '',
						newPassword: '',
						oldPassword: '',
						imageFile: null,
					});
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [navigate]);

	const handleChange = e => {
		const { name, value, files } = e.target;
		if (name === 'imageFile') {
			const file = files[0];
			setFormData(prev => ({ ...prev, [name]: file }));
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => setImagePreview(reader.result);
				reader.readAsDataURL(file);
			} else {
				setImagePreview(null);
			}
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleParametersChange = e => {
		const { name, value } = e.target;
		setParametersFormData(prev => ({ ...prev, [name]: value }));
	};

	const toggleSection = section =>
		setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));

	const handleSubmit = async section => {
		if (!user?.userId) {
			setError('Пользователь не авторизован');
			return;
		}

		const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};
		const updatedUserData = {
			...storedUserData,
			user: { ...storedUserData.user },
		};

		if (section === 'parameters') {
			const requestBody = {};
			const updatedFields = {};

			if (
				parametersFormData.currencyId &&
				parametersFormData.currencyId !== userParameters?.currencyId.toString()
			) {
				requestBody.currencyId = parseInt(parametersFormData.currencyId);
				updatedFields.currencyId = requestBody.currencyId;
				updatedUserData.user.currencyId = requestBody.currencyId;
			}
			if (
				parametersFormData.maxMonthlySpending &&
				parametersFormData.maxMonthlySpending !==
					userParameters?.maxMonthlySpending.toString()
			) {
				requestBody.maxMonthlySpending = parseFloat(
					parametersFormData.maxMonthlySpending
				);
				updatedFields.maxMonthlySpending = requestBody.maxMonthlySpending;
			}
			if (
				parametersFormData.maxEntertainmentSpending &&
				parametersFormData.maxEntertainmentSpending !==
					userParameters?.maxEntertainmentSpending.toString()
			) {
				requestBody.maxEntertainmentSpending = parseFloat(
					parametersFormData.maxEntertainmentSpending
				);
				updatedFields.maxEntertainmentSpending =
					requestBody.maxEntertainmentSpending;
			}
			if (
				parametersFormData.maxSavingsGoal &&
				parametersFormData.maxSavingsGoal !==
					userParameters?.maxSavingsGoal.toString()
			) {
				requestBody.maxSavingsGoal = parseFloat(
					parametersFormData.maxSavingsGoal
				);
				updatedFields.maxSavingsGoal = requestBody.maxSavingsGoal;
			}

			if (Object.keys(requestBody).length === 0) {
				setSectionErrors(prev => ({ ...prev, parameters: 'Нет изменений' }));
				return;
			}

			try {
				const response = await fetch(
					`${API_BASE_URL}/user/${user.userId}/parameters`,
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(requestBody),
					}
				);
				if (!response.ok) throw new Error('Ошибка обновления параметров');
				const result = await response.json();
				const updatedParameters = {
					...userParameters,
					...updatedFields,
					id: result.id,
				};
				setUserParameters(updatedParameters);
				localStorage.setItem(
					'userParameters',
					JSON.stringify(updatedParameters)
				);
				localStorage.setItem('userData', JSON.stringify(updatedUserData));
				setSectionsOpen(prev => ({ ...prev, parameters: false }));
				setSectionErrors(prev => ({ ...prev, parameters: null }));
				setSuccessMessage('Параметры обновлены');
				setTimeout(() => setSuccessMessage(null), 3000);
			} catch (err) {
				setSectionErrors(prev => ({ ...prev, parameters: err.message }));
			}
			return;
		}

		const formDataToSend = new FormData();

		switch (section) {
			case 'profile':
				if (formData.username && formData.username !== user.username) {
					formDataToSend.append('username', formData.username);
					updatedUserData.user.username = formData.username;
				}
				break;
			case 'contact':
				if (!formData.password) {
					setSectionErrors(prev => ({ ...prev, contact: 'Введите пароль' }));
					return;
				}
				if (formData.email && formData.email !== user.email) {
					formDataToSend.append('email', formData.email);
					updatedUserData.user.email = formData.email;
				}
				formDataToSend.append('password', formData.password);
				break;
			case 'password':
				if (!formData.oldPassword) {
					setSectionErrors(prev => ({
						...prev,
						password: 'Введите старый пароль',
					}));
					return;
				}
				if (formData.newPassword)
					formDataToSend.append('newPassword', formData.newPassword);
				formDataToSend.append('oldPassword', formData.oldPassword);
				break;
			case 'avatar':
				if (formData.imageFile) {
					formDataToSend.append('imageFile', formData.imageFile);
					updatedUserData.user.imageUrl = `${API_BASE_URL.replace(
						'/api',
						''
					)}/temp-image-url`;
				}
				break;
			default:
				return;
		}

		if (formDataToSend.entries().next().done && section !== 'password') {
			setSectionErrors(prev => ({ ...prev, [section]: 'Нет изменений' }));
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/user/${user.userId}`, {
				method: 'PUT',
				body: formDataToSend,
			});
			if (!response.ok) {
				const errorText = await response.text();
				if (errorText.includes('Неверный старый пароль')) {
					setSectionErrors(prev => ({
						...prev,
						[section]: 'Неверный старый пароль',
					}));
					return;
				}
				throw new Error('Ошибка обновления профиля');
			}
			const result = await response.json();
			const updatedUser = result.user;
			Object.keys(updatedUser).forEach(key => {
				if (updatedUser[key] !== user[key])
					updatedUserData.user[key] = updatedUser[key];
			});
			localStorage.setItem('userData', JSON.stringify(updatedUserData));
			setFormData({
				username: updatedUserData.user.username || '',
				email: updatedUserData.user.email || '',
				password: '',
				newPassword: '',
				oldPassword: '',
				imageFile: null,
			});
			setImagePreview(null);
			setSectionsOpen({
				profile: false,
				contact: false,
				password: false,
				avatar: false,
				parameters: false,
			});
			setSectionErrors({
				profile: null,
				contact: null,
				password: null,
				avatar: null,
				parameters: null,
			});
			setSuccessMessage(`Секция "${section}" обновлена`);
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err) {
			setError(err.message);
		}
	};

	if (loading)
		return <div className='text-gray-200 text-center p-6'>Загрузка...</div>;
	if (error)
		return <div className='text-gray-200 text-center p-6'>{error}</div>;

	const avatarUrl = user?.imageUrl
		? `${API_BASE_URL.replace('/api', '')}/${user.imageUrl}`
		: '/images/avatar_placeholder.png';

	return (
		<div className='min-h-screen bg-gray-900 text-gray-200 p-6'>
			<div className='max-w-4xl mx-auto'>
				<h2 className='text-3xl font-bold text-white mb-8 text-center'>
					Настройки
				</h2>
				<div className='bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700'>
					<div className='space-y-4'>
						<div className='border-b border-gray-700'>
							<button
								onClick={() => toggleSection('avatar')}
								className='w-full text-left py-4 text-xl font-semibold text-white hover:text-blue-400 transition-colors flex items-center justify-between'
							>
								<span>Изменить аватар</span>
								<motion.svg
									className='w-5 h-5 transform transition-transform'
									animate={
										sectionsOpen.avatar ? { rotate: 180 } : { rotate: 0 }
									}
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</motion.svg>
							</button>
							<AnimatePresence>
								{sectionsOpen.avatar && (
									<motion.div
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={{
											hidden: { height: 0, opacity: 0, overflow: 'hidden' },
											visible: {
												height: 'auto',
												opacity: 1,
												transition: { duration: 0.3, ease: 'easeInOut' },
											},
										}}
										className='pt-4 pb-2 space-y-4'
									>
										<div className='flex flex-col items-center mb-4'>
											<img
												src={avatarUrl}
												alt={`${user?.username}'s avatar`}
												className='w-32 h-32 rounded-full object-cover border-2 border-gray-600 shadow-md'
											/>
											<p className='text-gray-400 text-sm mt-2'>
												Текущий аватар
											</p>
										</div>
										<div>
											<label
												htmlFor='imageFile'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Аватар (изображение)
											</label>
											<input
												type='file'
												id='imageFile'
												name='imageFile'
												accept='image/*'
												onChange={handleChange}
												className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 transition duration-300 ease-in-out'
											/>
											{imagePreview && (
												<img
													src={imagePreview}
													alt='Preview'
													className='mt-4 w-32 h-32 rounded-full object-cover'
												/>
											)}
										</div>
										{sectionErrors.avatar && (
											<p className='text-red-500 text-sm mt-2'>
												{sectionErrors.avatar}
											</p>
										)}
										<button
											type='button'
											onClick={() => handleSubmit('avatar')}
											className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
										>
											Сохранить аватар
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div className='border-b border-gray-700'>
							<button
								onClick={() => toggleSection('profile')}
								className='w-full text-left py-4 text-xl font-semibold text-white hover:text-blue-400 transition-colors flex items-center justify-between'
							>
								<span>Редактировать профиль</span>
								<motion.svg
									className='w-5 h-5 transform transition-transform'
									animate={
										sectionsOpen.profile ? { rotate: 180 } : { rotate: 0 }
									}
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</motion.svg>
							</button>
							<AnimatePresence>
								{sectionsOpen.profile && (
									<motion.div
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={{
											hidden: { height: 0, opacity: 0, overflow: 'hidden' },
											visible: {
												height: 'auto',
												opacity: 1,
												transition: { duration: 0.3, ease: 'easeInOut' },
											},
										}}
										className='pt-4 pb-2 space-y-4'
									>
										<div>
											<label
												htmlFor='username'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Имя пользователя
											</label>
											<input
												type='text'
												id='username'
												name='username'
												value={formData.username}
												onChange={handleChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите новое имя пользователя'
											/>
										</div>
										{sectionErrors.profile && (
											<p className='text-red-500 text-sm mt-2'>
												{sectionErrors.profile}
											</p>
										)}
										<button
											type='button'
											onClick={() => handleSubmit('profile')}
											className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
										>
											Сохранить профиль
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div className='border-b border-gray-700'>
							<button
								onClick={() => toggleSection('contact')}
								className='w-full text-left py-4 text-xl font-semibold text-white hover:text-blue-400 transition-colors flex items-center justify-between'
							>
								<span>Редактировать контактные данные</span>
								<motion.svg
									className='w-5 h-5 transform transition-transform'
									animate={
										sectionsOpen.contact ? { rotate: 180 } : { rotate: 0 }
									}
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</motion.svg>
							</button>
							<AnimatePresence>
								{sectionsOpen.contact && (
									<motion.div
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={{
											hidden: { height: 0, opacity: 0, overflow: 'hidden' },
											visible: {
												height: 'auto',
												opacity: 1,
												transition: { duration: 0.3, ease: 'easeInOut' },
											},
										}}
										className='pt-4 pb-2 space-y-4'
									>
										<div>
											<label
												htmlFor='email'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Email
											</label>
											<input
												type='email'
												id='email'
												name='email'
												value={formData.email}
												onChange={handleChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите новый email'
											/>
										</div>
										<div>
											<label
												htmlFor='password'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Пароль для подтверждения
											</label>
											<input
												type='password'
												id='password'
												name='password'
												value={formData.password}
												onChange={handleChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите текущий пароль'
											/>
										</div>
										{sectionErrors.contact && (
											<p className='text-red-500 text-sm mt-2'>
												{sectionErrors.contact}
											</p>
										)}
										<button
											type='button'
											onClick={() => handleSubmit('contact')}
											className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
										>
											Сохранить контактные данные
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div className='border-b border-gray-700'>
							<button
								onClick={() => toggleSection('password')}
								className='w-full text-left py-4 text-xl font-semibold text-white hover:text-blue-400 transition-colors flex items-center justify-between'
							>
								<span>Изменить пароль</span>
								<motion.svg
									className='w-5 h-5 transform transition-transform'
									animate={
										sectionsOpen.password ? { rotate: 180 } : { rotate: 0 }
									}
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</motion.svg>
							</button>
							<AnimatePresence>
								{sectionsOpen.password && (
									<motion.div
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={{
											hidden: { height: 0, opacity: 0, overflow: 'hidden' },
											visible: {
												height: 'auto',
												opacity: 1,
												transition: { duration: 0.3, ease: 'easeInOut' },
											},
										}}
										className='pt-4 pb-2 space-y-4'
									>
										<div>
											<label
												htmlFor='oldPassword'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Старый пароль
											</label>
											<input
												type='password'
												id='oldPassword'
												name='oldPassword'
												value={formData.oldPassword}
												onChange={handleChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите текущий пароль'
											/>
										</div>
										<div>
											<label
												htmlFor='newPassword'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Новый пароль
											</label>
											<input
												type='password'
												id='newPassword'
												name='newPassword'
												value={formData.newPassword}
												onChange={handleChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите новый пароль'
											/>
										</div>
										{sectionErrors.password && (
											<p className='text-red-500 text-sm mt-2'>
												{sectionErrors.password}
											</p>
										)}
										<button
											type='button'
											onClick={() => handleSubmit('password')}
											className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
										>
											Изменить пароль
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div className='border-b border-gray-700'>
							<button
								onClick={() => toggleSection('parameters')}
								className='w-full text-left py-4 text-xl font-semibold text-white hover:text-blue-400 transition-colors flex items-center justify-between'
							>
								<span>Дополнительные настройки</span>
								<motion.svg
									className='w-5 h-5 transform transition-transform'
									animate={
										sectionsOpen.parameters ? { rotate: 180 } : { rotate: 0 }
									}
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</motion.svg>
							</button>
							<AnimatePresence>
								{sectionsOpen.parameters && (
									<motion.div
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={{
											hidden: { height: 0, opacity: 0, overflow: 'hidden' },
											visible: {
												height: 'auto',
												opacity: 1,
												transition: { duration: 0.3, ease: 'easeInOut' },
											},
										}}
										className='pt-4 pb-2 space-y-4'
									>
										<div>
											<label
												htmlFor='currencyId'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Валюта
											</label>
											<select
												id='currencyId'
												name='currencyId'
												value={parametersFormData.currencyId}
												onChange={handleParametersChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-gray-300 focus:ring-2 focus:ring-blue-500'
											>
												<option className='text-gray-300' value='' disabled>
													Выберите валюту
												</option>
												{currencies.map(currency => (
													<option
														className='text-gray-300'
														key={currency.id}
														value={currency.id}
													>
														{currency.currencyName} ({currency.currencyCode})
													</option>
												))}
											</select>
										</div>
										<div>
											<label
												htmlFor='maxMonthlySpending'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Максимальные ежемесячные траты
											</label>
											<input
												type='number'
												id='maxMonthlySpending'
												name='maxMonthlySpending'
												value={parametersFormData.maxMonthlySpending}
												onChange={handleParametersChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите максимальные траты'
											/>
										</div>
										<div>
											<label
												htmlFor='maxEntertainmentSpending'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Максимальные траты на развлечения
											</label>
											<input
												type='number'
												id='maxEntertainmentSpending'
												name='maxEntertainmentSpending'
												value={parametersFormData.maxEntertainmentSpending}
												onChange={handleParametersChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите максимальные траты на развлечения'
											/>
										</div>
										<div>
											<label
												htmlFor='maxSavingsGoal'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Ваша цель накоплений
											</label>
											<input
												type='number'
												id='maxSavingsGoal'
												name='maxSavingsGoal'
												value={parametersFormData.maxSavingsGoal}
												onChange={handleParametersChange}
												className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400'
												placeholder='Введите цель накоплений'
											/>
										</div>
										{sectionErrors.parameters && (
											<p className='text-red-500 text-sm mt-2'>
												{sectionErrors.parameters}
											</p>
										)}
										<button
											type='button'
											onClick={() => handleSubmit('parameters')}
											className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
										>
											Сохранить настройки
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
					<div className='mt-6 text-center'>
						<button
							type='button'
							onClick={() => navigate('/profile')}
							className='py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
						>
							Вернуться к профилю
						</button>
					</div>
				</div>
			</div>
			<AnimatePresence>
				{successMessage && (
					<motion.div
						className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50'
						initial='hidden'
						animate='visible'
						exit='exit'
						variants={{
							hidden: { opacity: 0, y: -20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
							exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
						}}
					>
						<p>{successMessage}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Settings;
