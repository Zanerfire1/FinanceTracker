import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CourseDetailScreen = () => {
	const { id } = useParams();
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('userData')) || null;
	const userId = user?.userId;

	useEffect(() => {
		const fetchCourse = async () => {
			if (!userId) {
				navigate('/login');
				return;
			}

			setLoading(true);
			try {
				const response = await fetch(
					`${API_BASE_URL}/courses/${id}?userId=${userId}`
				);
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные курса');
				}
				setCourse(await response.json());
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [id, userId, navigate]);

	const handleSubscribeClick = () => {
		navigate('/subscribe');
	};

	const formatDescription = description => {
		if (!description) return [];

		const paragraphs = description
			.replace(/\r\n/g, '\n')
			.split('\n')
			.map(line => line.trim())
			.filter(line => line.length > 0);

		const formattedSections = [];
		let currentSection = { heading: null, content: [] };

		paragraphs.forEach(line => {
			const headingMatch = line.match(/^\*(.+?)\*$/);
			if (headingMatch) {
				if (currentSection.content.length > 0 || currentSection.heading) {
					formattedSections.push(currentSection);
				}
				currentSection = { heading: headingMatch[1], content: [] };
			} else {
				currentSection.content.push(line);
			}
		});

		if (currentSection.content.length > 0 || currentSection.heading) {
			formattedSections.push(currentSection);
		}

		return formattedSections;
	};

	const getIframeSrc = videoUrl => {
		if (!videoUrl) return null;

		const youtubeMatch = videoUrl.match(
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
		);
		if (youtubeMatch) {
			const videoId = youtubeMatch[1];
			return `https://www.youtube.com/embed/${videoId}`;
		}

		return videoUrl;
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen bg-gray-900 text-gray-200'>
				<p className='text-xl'>Загрузка...</p>
			</div>
		);
	}

	if (error || !course) {
		return (
			<div className='flex justify-center items-center h-screen bg-gray-900 text-gray-200'>
				<p className='text-xl text-red-400'>{error || 'Курс не найден'}</p>
			</div>
		);
	}

	const isVideoAccessible = !course.isPaid || (course.isPaid && !!userId);
	const formattedDescription = formatDescription(course.description);
	const iframeSrc = getIframeSrc(course.videoUrl);

	return (
		<div className='min-h-screen bg-gray-900 text-gray-200 p-8'>
			<h1 className='text-5xl font-extrabold text-white mb-6 text-center tracking-tight'>
				{course.courseName}
			</h1>

			<button
				onClick={() => navigate('/courses')}
				className='mb-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50'
			>
				Назад к курсам
			</button>

			<div className='max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 shadow-xl'>
				{iframeSrc && isVideoAccessible ? (
					<div className='mb-10'>
						<h3 className='text-2xl font-semibold text-white mb-4'>
							Видео курса
						</h3>
						<div className='relative overflow-hidden rounded-xl shadow-lg aspect-video'>
							<iframe
								src={iframeSrc}
								title='Course Video'
								frameBorder='0'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen
								className='w-full h-full'
							></iframe>
						</div>
					</div>
				) : course.isPaid ? (
					<div className='mb-10 flex items-center gap-3 text-yellow-400 bg-yellow-500/10 p-4 rounded-xl'>
						<FaLock className='w-6 h-6' />
						<p className='text-lg'>Этот курс доступен только по подписке.</p>
						<motion.button
							whileHover={{ backgroundColor: '#9333ea' }}
							whileTap={{ opacity: 0.9 }}
							onClick={handleSubscribeClick}
							className='py-3 px-6 bg-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all duration-300'
						>
							Приобрести подписку
						</motion.button>
					</div>
				) : (
					<div></div>
				)}

				<div className='mb-8'>
					<p className='text-gray-400 text-lg'>
						<span className='font-semibold text-gray-200'>Категория:</span>{' '}
						<span className='text-blue-400'>{course.categoryName}</span>
					</p>
				</div>

				<div className='space-y-8'>
					{formattedDescription.map((section, index) => (
						<div key={index}>
							{section.heading && (
								<h3 className='text-2xl font-bold text-white mb-4'>
									{section.heading}
								</h3>
							)}
							<div className='text-gray-300 leading-relaxed space-y-4'>
								{section.content.map((line, lineIndex) => (
									<p key={lineIndex}>{line}</p>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CourseDetailScreen;
