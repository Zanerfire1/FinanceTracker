import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegisterStore from '../store/useRegisterStore';

const API_BASE_URL = 'https://localhost:7292/api';

const RegisterScreen = () => {
	const {
		email,
		password,
		username,
		currencyId,
		currentBalance,
		setEmail,
		setPassword,
		setUsername,
		setCurrencyId,
		setCurrentBalance,
		reset,
	} = useRegisterStore();
	const [step, setStep] = useState(1);
	const [currencies, setCurrencies] = useState([]);
	const [avatar, setAvatar] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (
			localStorage.getItem('userData') &&
			localStorage.getItem('userData') !== 'null'
		)
			navigate('/dashboard', { replace: true });
	}, [navigate]);

	useEffect(() => {
		if (step === 3)
			fetch(`${API_BASE_URL}/currency/all`)
				.then(res => res.json())
				.then(data => setCurrencies(data))
				.catch(() => setCurrencies([]));
	}, [step]);

	const handleNext = () => setStep(prev => prev + 1);
	const handleBack = () => setStep(prev => prev - 1);
	const handleAvatarChange = e => setAvatar(e.target.files[0]);
	const handleLoginRedirect = () => navigate('/login');

	const handleRegister = async () => {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		formData.append('username', username || '');
		formData.append('currencyId', currencyId || '');
		formData.append('currentBalance', parseFloat(currentBalance) || 0);
		if (avatar) formData.append('imageFile', avatar);

		try {
			const response = await fetch(`${API_BASE_URL}/auth/register`, {
				method: 'POST',
				body: formData,
			});
			if (!response.ok) throw new Error('Ошибка регистрации');
			const data = await response.json();
			localStorage.setItem('userData', JSON.stringify(data));
			window.dispatchEvent(new Event('storage'));
			reset();
			navigate('/dashboard', { replace: true });
		} catch (error) {
			alert('Ошибка регистрации');
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden'>
			<div className='fixed inset-0 pointer-events-none z-0 flex items-center justify-center'>
				<div className='relative'>
					<div
						className='w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow'
						style={{ transform: 'translate(40%, 50px)' }}
					></div>
					<div
						className='w-[320px] h-[320px] bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow delay-500'
						style={{ transform: 'translate(-50%, 0%)' }}
					></div>
				</div>
			</div>
			<div className='bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10'>
				{step === 1 && (
					<div>
						<h2 className='text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8'>
							Регистрация
						</h2>
						<form
							onSubmit={e => {
								e.preventDefault();
								handleNext();
							}}
							className='space-y-6'
						>
							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-300'
								>
									Email
								</label>
								<input
									type='email'
									id='email'
									placeholder='Введите email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									className='mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out'
									required
								/>
							</div>
							<div className='relative'>
								<label
									htmlFor='password'
									className='block text-sm font-medium text-gray-300'
								>
									Пароль
								</label>
								<input
									type={showPassword ? 'text' : 'password'}
									id='password'
									placeholder='Введите пароль (мин. 6 символов)'
									value={password}
									onChange={e => setPassword(e.target.value)}
									minLength={6}
									className='mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-300 ease-in-out invalid:border-red-500'
									required
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-400 hover:text-purple-400 transition duration-200'
								>
									{showPassword ? (
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
											/>
										</svg>
									) : (
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
											/>
										</svg>
									)}
								</button>
							</div>
							<button
								type='submit'
								className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1'
							>
								Далее
							</button>
						</form>
					</div>
				)}
				{step === 2 && (
					<div>
						<h2 className='text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8'>
							Имя пользователя
						</h2>
						<div className='space-y-6'>
							<input
								type='text'
								placeholder='Имя пользователя (необязательно)'
								value={username}
								onChange={e => setUsername(e.target.value)}
								className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out'
							/>
							<div className='flex space-x-4'>
								<button
									onClick={handleBack}
									className='w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out'
								>
									Назад
								</button>
								<button
									onClick={handleNext}
									className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1'
								>
									Пропустить
								</button>
							</div>
						</div>
					</div>
				)}
				{step === 3 && (
					<div>
						<h2 className='text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8'>
							Выберите валюту
						</h2>
						<div className='space-y-4'>
							{currencies.length > 0 ? (
								<div className='grid grid-cols-2 gap-2'>
									{currencies.map(cur => (
										<button
											key={cur.id}
											onClick={() => setCurrencyId(cur.id)}
											className={`py-2 px-4 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${
												currencyId === cur.id
													? 'bg-gradient-to-r from-purple-600 to-pink-600'
													: 'bg-gray-700 hover:bg-gray-600'
											}`}
										>
											{cur.currencyName} ({cur.currencyCode})
										</button>
									))}
								</div>
							) : (
								<p className='text-gray-400'>Загрузка валют...</p>
							)}
							<div className='flex space-x-4'>
								<button
									onClick={handleBack}
									className='w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out'
								>
									Назад
								</button>
								<button
									onClick={handleNext}
									className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1'
								>
									{currencyId ? 'Далее' : 'Пропустить'}
								</button>
							</div>
						</div>
					</div>
				)}
				{step === 4 && (
					<div>
						<h2 className='text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8'>
							Начальный баланс
						</h2>
						<div className='space-y-6'>
							<input
								type='number'
								placeholder='Начальный баланс (необязательно)'
								value={currentBalance}
								onChange={e => setCurrentBalance(e.target.value)}
								className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out'
							/>
							<div className='flex space-x-4'>
								<button
									onClick={handleBack}
									className='w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out'
								>
									Назад
								</button>
								<button
									onClick={handleNext}
									className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1'
								>
									Далее
								</button>
							</div>
						</div>
					</div>
				)}
				{step === 5 && (
					<div>
						<h2 className='text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8'>
							Шаг 5: Загрузите аватар
						</h2>
						<div className='space-y-6'>
							<input
								type='file'
								accept='image/*'
								onChange={handleAvatarChange}
								className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 transition duration-300 ease-in-out'
							/>
							<div className='flex space-x-4'>
								<button
									onClick={handleBack}
									className='w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out'
								>
									Назад
								</button>
								<button
									onClick={handleRegister}
									className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1'
								>
									Завершить регистрацию
								</button>
							</div>
						</div>
					</div>
				)}
				<p className='mt-6 text-center text-sm text-gray-400'>
					Уже есть аккаунт?{' '}
					<button
						onClick={handleLoginRedirect}
						className='text-pink-400 hover:text-pink-300 font-medium focus:outline-none transition duration-200 ease-in-out'
					>
						Войти
					</button>
				</p>
			</div>
		</div>
	);
};

export default RegisterScreen;
