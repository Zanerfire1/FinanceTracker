import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaArrowLeft } from 'react-icons/fa';

const Terms = () => {
	const user = useAuthStore(state => state.user);
	const navigate = useNavigate();

	const handleBack = () => navigate(-1);

	return (
		<div className='min-h-screen py-20 my-5 bg-gray-900 text-gray-200 p-6'>
			<div className='max-w-4xl mx-auto'>
				<button
					onClick={handleBack}
					className='flex items-center gap-2 text-blue-400 hover:text-blue-500 transition-colors mb-6'
				>
					<FaArrowLeft className='w-5 h-5' /> Назад
				</button>
				<h1 className='text-4xl font-bold text-white mb-8 border-b-2 border-gray-700 pb-2'>
					Условия использования
				</h1>
				{user && (
					<div className='mb-8 p-6 bg-gray-800 rounded-lg shadow-lg'>
						<p className='text-xl'>
							Привет,{' '}
							<span className='font-semibold text-blue-400'>
								{user.username || 'Гость'}
							</span>
							! Ознакомьтесь с нашими условиями использования.
						</p>
					</div>
				)}
				<div className='space-y-8'>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							1. Введение
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Добро пожаловать в FinanceTracker! Настоящие Условия использования
							регулируют ваше использование нашего приложения и услуг. Используя
							FinanceTracker, вы соглашаетесь с этими Условиями. Если вы не
							согласны с ними, пожалуйста, прекратите использование приложения.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							2. Регистрация и доступ
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Для использования большинства функций FinanceTracker вам
							необходимо зарегистрировать аккаунт. Вы соглашаетесь:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Предоставить достоверную информацию при регистрации.</li>
							<li>Не передавать данные вашего аккаунта третьим лицам.</li>
							<li>
								Немедленно уведомить нас о любом несанкционированном
								использовании.
							</li>
							<li>Быть старше 18 лет или иметь согласие родителей.</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Мы можем приостановить или удалить ваш аккаунт в случае нарушения
							этих Условий.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							3. Использование приложения
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							FinanceTracker предоставляет вам лицензию на использование
							приложения для личных целей. Вы соглашаетесь:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Не использовать приложение для незаконных целей.</li>
							<li>Не копировать или модифицировать приложение.</li>
							<li>Не загружать вредоносный контент.</li>
							<li>
								Не использовать автоматизированные средства без разрешения.
							</li>
							<li>Не нарушать права других пользователей.</li>
						</ul>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							4. Подписки и платежи
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Некоторые функции доступны по подписке. Оформляя подписку, вы
							соглашаетесь:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Предоставить корректные платёжные данные.</li>
							<li>Подписка продлевается автоматически.</li>
							<li>Стоимость подписки может изменяться.</li>
							<li>Возвраты возможны в течение 14 дней.</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Мы не несем ответственности за ошибки платёжных систем.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							5. Интеллектуальная собственность
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Весь контент FinanceTracker является нашей собственностью. Вы не
							имеете права:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Копировать или распространять контент.</li>
							<li>Создавать производные продукты.</li>
							<li>Удалять уведомления об авторских правах.</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Вы можете использовать материалы только для личного использования.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							6. Ограничение ответственности
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы предоставляем FinanceTracker "как есть" и не гарантируем:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Бесперебойную работу.</li>
							<li>Отсутствие ошибок.</li>
							<li>Точность финансовых рекомендаций.</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Мы не несем ответственности за убытки, вызванные:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Неправильным использованием.</li>
							<li>Действиями третьих лиц.</li>
							<li>Форс-мажорными обстоятельствами.</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Наша ответственность ограничена суммой, уплаченной за подписку.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							7. Прекращение использования
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Вы можете прекратить использование в любое время. Мы можем
							приостановить доступ в случае:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>Нарушения Условий.</li>
							<li>Подозрения в мошенничестве.</li>
							<li>Запроса правоохранительных органов.</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							После прекращения ваши данные будут удалены.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							8. Изменения в условиях
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы можем обновлять Условия. Продолжение использования означает
							согласие с новой версией.
						</p>
						<p className='text-gray-300 mt-4'>
							Дата последнего обновления: 07 марта 2025 года.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							9. Связь с нами
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Если у вас есть вопросы, свяжитесь с нами:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Email:</strong>{' '}
								<a
									href='mailto:support@financetracker.com'
									className='text-blue-400 hover:underline'
								>
									support@financetracker.com
								</a>
							</li>
							<li>
								<strong>Телефон:</strong> +1-800-555-0123
							</li>
							<li>
								<strong>Адрес:</strong> 123 Финансовая улица, Город, Страна
							</li>
						</ul>
						<p className='text-gray-300 mt-4'>Мы ответим в течение 30 дней.</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Terms;
