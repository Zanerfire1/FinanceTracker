import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
	const navigate = useNavigate();

	const fadeInUp = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: 'easeOut' },
		},
	};

	const AnimatedCard = ({ children, className, whileHover }) => {
		const cardRef = useRef(null);
		const controls = useAnimation();

		useEffect(() => {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						controls.start('visible');
						observer.unobserve(entry.target);
					}
				},
				{ threshold: 0.2 }
			);

			if (cardRef.current) {
				observer.observe(cardRef.current);
			}

			return () => {
				if (cardRef.current) {
					observer.unobserve(cardRef.current);
				}
			};
		}, [controls]);

		return (
			<motion.div
				ref={cardRef}
				variants={fadeInUp}
				initial='hidden'
				animate={controls}
				whileHover={whileHover}
				className={className}
			>
				{children}
			</motion.div>
		);
	};

	const handleSubscribeClick = () => {
		navigate('/subscribe');
	};

	return (
		<div className='min-h-screen py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white'>
			<div className='relative overflow-visible'>
				<div
					className='absolute inset-x-0 -bottom-32 h-full w-full bg-gradient-to-t from-pink-500/50 to-transparent opacity-70'
					style={{
						background:
							'radial-gradient(circle at 50% 130%, rgba(236, 72, 153, 0.8), transparent 55%)',
					}}
				></div>
				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-10'>
					<motion.div
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='text-center relative z-10'
					>
						<h1 className='text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
							Добро пожаловать в Finance Tracker!
						</h1>
						<p className='mt-6 text-xl text-gray-300'>
							Управляйте своими финансами легко и эффективно. Отслеживайте
							доходы, расходы и оптимизируйте свои финансовые потоки.
						</p>
						<div className='mt-10'>
							<Link
								to='/login'
								className='inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/30 transition-all'
							>
								Начать бесплатно
								<svg
									className='ml-3 -mr-1 h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 8l4 4m0 0l-4 4m4-4H3'
									/>
								</svg>
							</Link>
						</div>
					</motion.div>
				</div>
			</div>

			<div className='relative py-20 bg-gray-900'>
				<div className='absolute inset-0 bg-gradient-radial from-green-500/20 to-transparent opacity-50'></div>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<motion.h2
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='text-4xl font-bold text-center text-white'
					>
						Как работает Finance Tracker?
					</motion.h2>
					<motion.p
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='mt-4 text-xl text-gray-300 text-center'
					>
						Начните управлять своими финансами в несколько простых шагов
					</motion.p>
					<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						<AnimatedCard
							className='bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex justify-center'>
								<div className='h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500'>
									<svg
										className='h-8 w-8 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
								</div>
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>
								Регистрация
							</h3>
							<p className='mt-2 text-gray-300'>
								Создайте учетную запись за минуту
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex justify-center'>
								<div className='h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500'>
									<svg
										className='h-8 w-8 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>
								Аналитика
							</h3>
							<p className='mt-2 text-gray-300'>
								Записывайте ваши расходы, все в ваших руках
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex justify-center'>
								<div className='h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500'>
									<svg
										className='h-8 w-8 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>
								Отслеживание
							</h3>
							<p className='mt-2 text-gray-300'>
								Автоматически записывайте транзакции
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex justify-center'>
								<div className='h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500'>
									<svg
										className='h-8 w-8 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M16 8v8m-4-8v8m-4-8v8m8 4V4M4 20h16'
										/>
									</svg>
								</div>
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>Анализ</h3>
							<p className='mt-2 text-gray-300'>
								Получайте отчеты и оптимизируйте бюджет
							</p>
						</AnimatedCard>
					</div>
				</div>
			</div>

			<div className='relative py-24 bg-gray-800'>
				<div className='absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent opacity-50'></div>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<motion.h2
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='text-4xl font-bold text-center text-white mb-6'
					>
						Выберите свою подписку
					</motion.h2>
					<motion.p
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='mt-4 text-xl text-gray-300 text-center max-w-2xl mx-auto'
					>
						Получите доступ к расширенным возможностям Finance Tracker с нашими
						планами подписки.
					</motion.p>
					<div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-10'>
						<AnimatedCard className='bg-gray-900 p-10 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative min-h-[500px] flex flex-col justify-between'>
							<div>
								<div className='flex items-center justify-center h-14 w-14 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white'>
									<svg
										className='h-7 w-7'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M5 13l4 4L19 7'
										/>
									</svg>
								</div>
								<h3 className='mt-8 text-xl font-semibold text-white text-center'>
									Бесплатный план
								</h3>
								<p className='mt-4 text-gray-300 text-center'>
									Начните управлять своими финансами с основными функциями:
								</p>
								<ul className='mt-6 space-y-4 text-gray-300'>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Учет доходов и расходов
										</span>
									</li>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Базовая аналитика
										</span>
									</li>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Безопасность данных
										</span>
									</li>
								</ul>
							</div>
							<div className='mt-auto flex justify-center'>
								<p className='text-2xl font-bold text-white'>Бесплатно</p>
							</div>
						</AnimatedCard>
						<AnimatedCard className='bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-10 rounded-2xl shadow-2xl hover:shadow-[0_0_20px_rgba(147,51,234,0.7)] transition-all duration-300 border-4 border-purple-500 relative overflow-hidden min-h-[500px] flex flex-col justify-between'>
							<div>
								<div className='absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl'>
									Лучший выбор
								</div>
								<div className='relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'>
									<svg
										className='h-8 w-8'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 10V3L4 14h7v7l9-11h-7z'
										/>
									</svg>
								</div>
								<h3 className='mt-8 text-2xl font-extrabold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300'>
									Премиум план
								</h3>
								<p className='mt-4 text-gray-200 text-center font-medium'>
									Откройте для себя новый уровень финансового контроля с
									эксклюзивными возможностями:
								</p>
								<ul className='mt-6 space-y-4 text-gray-100'>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Все функции бесплатного плана
										</span>
									</li>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Расширенная аналитика и прогнозы
										</span>
									</li>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Эксклюзивные видеоролики для повышения финансовой
											грамотности
										</span>
									</li>
									<li className='flex items-start'>
										<div className='flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1'>
											<svg
												className='h-4 w-4 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<span className='text-lg leading-relaxed'>
											Персонализированные финансовые советы
										</span>
									</li>
								</ul>
							</div>
							<div className='mt-auto flex justify-center'>
								<div className='relative'>
									<p className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500'>
										$1.99/месяц
									</p>
									<div className='absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full'></div>
								</div>
							</div>
							<motion.button
								whileHover={{ backgroundColor: '#9333ea' }}
								whileTap={{ opacity: 0.9 }}
								onClick={handleSubscribeClick}
								className='mt-8 w-full py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all duration-300'
							>
								Приобрести подписку
							</motion.button>
						</AnimatedCard>
					</div>
				</div>
			</div>

			<div className='relative py-20 bg-gray-800'>
				<div className='absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent opacity-50'></div>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<motion.h2
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='text-4xl font-bold text-center text-white'
					>
						Почему выбирают Finance Tracker?
					</motion.h2>
					<div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8'>
						<AnimatedCard
							className='bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
								<svg
									className='h-6 w-6'
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
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>
								Учет всех операций
							</h3>
							<p className='mt-2 text-gray-300'>
								Ведите учет всех финансовых операций в одном месте. Доходы,
								расходы, инвестиции — все под контролем.
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
									/>
								</svg>
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>
								Аналитика и отчеты
							</h3>
							<p className='mt-2 text-gray-300'>
								Получайте детальные отчеты и аналитику по вашим финансам.
								Визуализация данных помогает лучше понять свои привычки.
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
									/>
								</svg>
							</div>
							<h3 className='mt-6 text-xl font-semibold text-white'>
								Безопасность данных
							</h3>
							<p className='mt-2 text-gray-300'>
								Ваши данные защищены современными технологиями шифрования. Мы
								гарантируем конфиденциальность и безопасность.
							</p>
						</AnimatedCard>
					</div>
				</div>
			</div>

			<div className='relative py-24 bg-gray-800'>
				<div className='absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent opacity-50'></div>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<motion.h2
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='text-4xl font-bold text-center text-white mb-6'
					>
						Что предоставляет наш сервис?
					</motion.h2>
					<motion.p
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='mt-4 text-xl text-gray-300 text-center max-w-2xl mx-auto'
					>
						Мы помогаем вам стать финансово грамотнее с нашими курсами и
						эксклюзивными видеоматериалами.
					</motion.p>
					<div className='mt-16'>
						<div className='space-y-4'>
							<AnimatedCard className='bg-gray-900 rounded-xl shadow-lg overflow-hidden'>
								<button
									className='w-full p-6 flex items-center justify-between text-left text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-600 transition-colors duration-300'
									onClick={e => {
										e.currentTarget.nextElementSibling.classList.toggle(
											'hidden'
										);
									}}
								>
									<span className='flex items-center'>
										<svg
											className='h-6 w-6 mr-3'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332-.477-4.5-1.253'
											/>
										</svg>
										Бесплатные курсы по финансовой грамотности
									</span>
									<svg
										className='h-6 w-6 transform transition-transform duration-300'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</button>
								<div className='p-6 text-gray-300 bg-gray-800'>
									<p className='mb-4'>
										Получите доступ к базовым знаниям о финансах совершенно
										бесплатно:
									</p>
									<ul className='space-y-3'>
										<li className='flex items-start'>
											<div className='flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1'>
												<svg
													className='h-3 w-3 text-white'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											</div>
											<span className='text-lg leading-relaxed'>
												Основы управления финансами
											</span>
										</li>
										<li className='flex items-start'>
											<div className='flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1'>
												<svg
													className='h-3 w-3 text-white'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											</div>
											<span className='text-lg leading-relaxed'>
												Планирование бюджета
											</span>
										</li>
										<li className='flex items-start'>
											<div className='flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1'>
												<svg
													className='h-3 w-3 text-white'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											</div>
											<span className='text-lg leading-relaxed'>
												Советы по экономии
											</span>
										</li>
									</ul>
									<p className='mt-4 text-center text-lg font-semibold text-white'>
										Доступно всем
									</p>
								</div>
							</AnimatedCard>
							<AnimatedCard className='bg-gray-900 rounded-xl shadow-lg overflow-hidden'>
								<button
									className='w-full p-6 flex items-center justify-between text-left text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:bg-purple-600 transition-colors duration-300'
									onClick={e => {
										e.currentTarget.nextElementSibling.classList.toggle(
											'hidden'
										);
									}}
								>
									<span className='flex items-center'>
										<svg
											className='h-6 w-6 mr-3'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
										Эксклюзивные видеокурсы
									</span>
									<svg
										className='h-6 w-6 transform transition-transform duration-300'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</button>
								<div className='hidden p-6 text-gray-300 bg-gray-800'>
									<p className='mb-4'>
										Углубите свои знания с профессиональными видеокурсами для
										подписчиков:
									</p>
									<ul className='space-y-3'>
										<li className='flex items-start'>
											<div className='flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1'>
												<svg
													className='h-3 w-3 text-white'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											</div>
											<span className='text-lg leading-relaxed'>
												Инвестиции для начинающих
											</span>
										</li>
										<li className='flex items-start'>
											<div className='flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1'>
												<svg
													className='h-3 w-3 text-white'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											</div>
											<span className='text-lg leading-relaxed'>
												Управление долгами
											</span>
										</li>
										<li className='flex items-start'>
											<div className='flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1'>
												<svg
													className='h-3 w-3 text-white'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											</div>
											<span className='text-lg leading-relaxed'>
												Финансовое планирование на годы вперёд
											</span>
										</li>
									</ul>
									<p className='mt-4 text-center text-lg font-semibold text-white'>
										Только с подпиской
									</p>
									<motion.button
										whileHover={{ backgroundColor: '#9333ea' }}
										whileTap={{ opacity: 0.9 }}
										onClick={handleSubscribeClick}
										className='mt-6 w-full py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all duration-300'
									>
										Оформить подписку
									</motion.button>
								</div>
							</AnimatedCard>
						</div>
					</div>
				</div>
			</div>

			<div className='relative py-20 bg-gray-800'>
				<div className='absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent opacity-50'></div>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<motion.h2
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='text-4xl font-bold text-center text-white'
					>
						Истории успеха
					</motion.h2>
					<motion.p
						initial='hidden'
						animate='visible'
						variants={fadeInUp}
						className='mt-4 text-xl text-gray-300 text-center'
					>
						Узнайте, как Finance Tracker помог нашим пользователям достичь
						финансовых целей.
					</motion.p>
					<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						<AnimatedCard
							className='bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex items-center space-x-4'>
								<img
									className='h-16 w-16 rounded-full'
									src='https://randomuser.me/api/portraits/women/44.jpg'
									alt='Анна'
								/>
								<div>
									<h3 className='text-xl font-semibold text-white'>
										Анна Иванова
									</h3>
									<p className='text-gray-400'>Фрилансер</p>
								</div>
							</div>
							<p className='mt-6 text-gray-300 italic'>
								"Finance Tracker помог мне понять, куда уходят деньги. Теперь я
								могу планировать свои расходы и откладывать на мечты!"
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex items-center space-x-4'>
								<img
									className='h-16 w-16 rounded-full'
									src='https://randomuser.me/api/portraits/men/32.jpg'
									alt='Иван'
								/>
								<div>
									<h3 className='text-xl font-semibold text-white'>
										Иван Петров
									</h3>
									<p className='text-gray-400'>Предприниматель</p>
								</div>
							</div>
							<p className='mt-6 text-gray-300 italic'>
								"Благодаря аналитике Finance Tracker я смог сократить ненужные
								расходы и увеличить прибыль своего бизнеса на 20%."
							</p>
						</AnimatedCard>
						<AnimatedCard
							className='bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
							whileHover={{ scale: 1.05 }}
						>
							<div className='flex items-center space-x-4'>
								<img
									className='h-16 w-16 rounded-full'
									src='https://randomuser.me/api/portraits/women/68.jpg'
									alt='Мария'
								/>
								<div>
									<h3 className='text-xl font-semibold text-white'>
										Мария Сидорова
									</h3>
									<p className='text-gray-400'>Бухгалтер</p>
								</div>
							</div>
							<p className='mt-6 text-gray-300 italic'>
								"Теперь я могу легко отслеживать все свои финансы в одном месте.
								Это экономит мне кучу времени!"
							</p>
						</AnimatedCard>
					</div>
				</div>
			</div>

			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeInUp}
				className='relative py-20 bg-gradient-to-r from-purple-500 to-pink-500'
			>
				<div className='absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-50'></div>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
					<motion.h2
						variants={fadeInUp}
						className='text-4xl font-bold text-white'
					>
						Готовы начать управлять своими финансами?
					</motion.h2>
					<motion.p variants={fadeInUp} className='mt-4 text-xl text-gray-100'>
						Присоединяйтесь к тысячам пользователей, которые уже улучшили свои
						финансовые привычки.
					</motion.p>
					<motion.div variants={fadeInUp} className='mt-8'>
						<Link
							to='/register'
							className='inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-purple-500 bg-white hover:bg-gray-50 shadow-lg hover:shadow-white/30 transition-all'
						>
							Начать бесплатно
							<svg
								className='ml-3 -mr-1 h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 8l4 4m0 0l-4 4m4-4H3'
								/>
							</svg>
						</Link>
					</motion.div>
				</div>
			</motion.div>

			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeInUp}
				className='py-12 bg-gray-900'
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<motion.p variants={fadeInUp} className='text-gray-300'>
						© 2023 Finance Tracker. Все права защищены.
					</motion.p>
					<motion.div variants={fadeInUp} className='mt-4'>
						<Link
							to='/privacy'
							className='text-gray-400 hover:text-gray-300 mx-4'
						>
							Политика конфиденциальности
						</Link>
						<Link
							to='/terms'
							className='text-gray-400 hover:text-gray-300 mx-4'
						>
							Условия использования
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
};

export default HomePage;
