import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { FaLock, FaPlayCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CoursesScreen = () => {
	const [categories, setCategories] = useState([]);
	const [subscription, setSubscription] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = user?.userId;

	useEffect(() => {
		const fetchData = async () => {
			if (!userId) {
				navigate('/login');
				return;
			}

			setLoading(true);
			try {
				try {
					const subscriptionResponse = await fetch(
						`${API_BASE_URL}/courses/paid-subscribers?userId=${userId}`
					);
					if (subscriptionResponse.ok) {
						const subscriptionData = await subscriptionResponse.json();
						const activeSubscription = subscriptionData.find(
							sub => new Date(sub.subscriptionEndDate) > new Date()
						);
						setSubscription(activeSubscription || null);
					} else {
						setSubscription(null);
					}
				} catch (subError) {
					setSubscription(null);
				}

				const coursesResponse = await fetch(
					`${API_BASE_URL}/courses/by-category`
				);
				if (!coursesResponse.ok) {
					throw new Error('Не удалось загрузить курсы');
				}
				const coursesData = await coursesResponse.json();

				if (!Array.isArray(coursesData)) {
					throw new Error('Данные курсов не являются массивом');
				}

				const validCategories = coursesData.map(category => ({
					...category,
					courses: Array.isArray(category.courses) ? category.courses : [],
				}));

				const sortedCategories = validCategories.map(category => ({
					...category,
					courses: [...category.courses].sort((a, b) => b.isPaid - a.isPaid),
				}));

				setCategories(sortedCategories);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [userId, navigate]);

	const handleCourseClick = (courseId, isPaid) => {
		if (isPaid && !subscription) {
			navigate('/subscribe');
		} else {
			navigate(`/course/${courseId}`);
		}
	};

	const truncateDescription = (text, maxLength = 100) => {
		if (!text) return '';
		return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen bg-gray-900 text-gray-200'>
				<p className='text-xl'>Загрузка...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-screen bg-gray-900 text-gray-200'>
				<p className='text-xl text-red-400'>{error}</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-900 text-gray-200 p-6'>
			<h1 className='text-4xl font-extrabold text-white mb-10 text-center'>
				Занятия
			</h1>

			{categories.length > 0 ? (
				<div className='space-y-10'>
					{categories.map(category => (
						<div key={category.categoryId} className='mb-8'>
							<h2 className='text-3xl font-bold text-gray-100 mb-6 border-b-2 border-blue-500 pb-2'>
								{category.categoryName}
							</h2>

							{category.courses && category.courses.length > 0 ? (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{category.courses.map(course => (
										<motion.div
											key={course.id}
											whileHover={{
												scale: 1.05,
												boxShadow: course.isPaid
													? '0 15px 30px rgba(245, 158, 11, 0.4)'
													: '0 10px 20px rgba(59, 130, 246, 0.3)',
											}}
											whileTap={{ scale: 0.95 }}
											onClick={() =>
												handleCourseClick(course.id, course.isPaid)
											}
											className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-300 ${
												course.isPaid && !subscription
													? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border-2 border-yellow-400 opacity-80 hover:opacity-90'
													: 'bg-gray-800 border border-gray-600 hover:border-blue-500'
											}`}
										>
											<div className='p-6'>
												{course.isPaid && (
													<div className='mb-4'>
														{subscription ? (
															<span className='inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full'>
																<FaPlayCircle className='w-5 h-5' />
																Доступно
															</span>
														) : (
															<span className='inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full'>
																<FaLock className='w-5 h-5' />
																Платно
															</span>
														)}
													</div>
												)}

												<h3 className='text-xl font-semibold text-white mb-3'>
													{course.courseName}
												</h3>
												<p className='text-gray-300 text-sm line-clamp-2'>
													{truncateDescription(course.description)}
												</p>
											</div>
										</motion.div>
									))}
								</div>
							) : (
								<p className='text-gray-400 text-center'>
									Нет курсов в этой категории.
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<p className='text-center text-gray-400 text-xl'>
					Нет доступных занятий.
				</p>
			)}
		</div>
	);
};

export default CoursesScreen;
