import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaArrowLeft } from 'react-icons/fa';

const Privacy = () => {
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
					<FaArrowLeft className='w-5 h-5' />
					Назад
				</button>
				<h1 className='text-4xl font-bold text-white mb-8 border-b-2 border-gray-700 pb-2'>
					Политика конфиденциальности
				</h1>
				{user && (
					<div className='mb-8 p-6 bg-gray-800 rounded-lg shadow-lg'>
						<p className='text-xl'>
							Привет,{' '}
							<span className='font-semibold text-blue-400'>
								{user.username || 'Гость'}
							</span>
							! Мы заботимся о безопасности твоих данных и стремимся обеспечить
							их максимальную защиту.
						</p>
					</div>
				)}
				<div className='space-y-8'>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							1. Введение
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Добро пожаловать в FinanceTracker! Мы стремимся защищать вашу
							конфиденциальность и обеспечивать безопасность ваших данных.
							Настоящая политика конфиденциальности объясняет, как мы собираем,
							используем, храним, защищаем и, при необходимости, передаём вашу
							информацию. Используя наше приложение, вы соглашаетесь с
							условиями, изложенными в этом документе. Пожалуйста, внимательно
							ознакомьтесь с ним.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							2. Какие данные мы собираем
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы собираем различные типы данных для обеспечения работы
							приложения и улучшения вашего опыта:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Личная информация:</strong> имя, фамилия, адрес
								электронной почты, номер телефона (по желанию), дата рождения и
								другие данные, которые вы предоставляете при регистрации или
								заполнении профиля.
							</li>
							<li>
								<strong>Финансовые данные:</strong> информация о ваших доходах,
								расходах, операциях, балансах и других финансовых показателях,
								которые вы вводите в приложение для управления финансами.
							</li>
							<li>
								<strong>Данные подписки:</strong> информация о вашей подписке на
								курсы финансовой грамотности, включая даты начала и окончания,
								тип подписки и статус оплаты.
							</li>
							<li>
								<strong>Технические данные:</strong> IP-адрес, тип устройства,
								операционная система, версия браузера, идентификаторы устройств,
								данные о местоположении (если разрешено) и другие метаданные,
								собираемые автоматически.
							</li>
							<li>
								<strong>Данные взаимодействия:</strong> история ваших действий в
								приложении, такие как просмотренные страницы, клики, время
								использования и предпочтения.
							</li>
						</ul>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							3. Как мы используем ваши данные
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы используем вашу информацию для следующих целей:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Предоставление услуг:</strong> обеспечение работы
								FinanceTracker, включая управление вашим аккаунтом, обработку
								транзакций и доступ к курсам.
							</li>
							<li>
								<strong>Персонализация:</strong> адаптация контента,
								рекомендаций и предложений на основе ваших финансовых привычек и
								интересов.
							</li>
							<li>
								<strong>Улучшение продукта:</strong> анализ данных для
								оптимизации функциональности приложения и устранения ошибок.
							</li>
							<li>
								<strong>Безопасность:</strong> мониторинг подозрительной
								активности, предотвращение мошенничества и защита ваших данных.
							</li>
							<li>
								<strong>Коммуникация:</strong> отправка уведомлений, обновлений,
								маркетинговых материалов (с вашего согласия) и ответов на ваши
								запросы.
							</li>
							<li>
								<strong>Юридические обязательства:</strong> выполнение
								требований законодательства, включая предоставление данных по
								запросу уполномоченных органов.
							</li>
						</ul>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							4. Хранение и защита данных
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы принимаем строгие меры для защиты ваших данных:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Шифрование:</strong> все данные передаются и хранятся с
								использованием современных протоколов шифрования (например,
								TLS).
							</li>
							<li>
								<strong>Серверы:</strong> данные хранятся на защищённых
								серверах, расположенных в надёжных дата-центрах.
							</li>
							<li>
								<strong>Доступ:</strong> доступ к вашим данным имеют только
								авторизованные сотрудники, подписавшие соглашения о
								конфиденциальности.
							</li>
							<li>
								<strong>Срок хранения:</strong> данные хранятся в течение
								времени, необходимого для выполнения указанных целей, или в
								соответствии с законодательством (например, 5 лет после
								завершения сотрудничества).
							</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Несмотря на все усилия, мы не можем гарантировать абсолютную
							безопасность данных в интернете. В случае утечки мы немедленно
							уведомим вас и примем меры для минимизации ущерба.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							5. Использование cookies и технологий отслеживания
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы используем cookies и аналогичные технологии для улучшения
							работы приложения:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Функциональные cookies:</strong> для сохранения ваших
								настроек и обеспечения работы приложения.
							</li>
							<li>
								<strong>Аналитические cookies:</strong> для сбора анонимной
								статистики использования (например, с помощью Google Analytics).
							</li>
							<li>
								<strong>Рекламные cookies:</strong> для показа релевантной
								рекламы (с вашего согласия).
							</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Вы можете управлять cookies через настройки вашего браузера. Отказ
							от некоторых cookies может ограничить функциональность приложения.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							6. Передача данных третьим лицам
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы не продаём ваши данные третьим лицам, но можем передавать их в
							следующих случаях:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Партнёры:</strong> сервисам, которые помогают нам
								предоставлять услуги (например, платёжным системам или
								хостинг-провайдерам), с обязательством конфиденциальности.
							</li>
							<li>
								<strong>Юридические требования:</strong> по запросу
								правоохранительных органов или в соответствии с законом.
							</li>
							<li>
								<strong>Бизнес-преобразования:</strong> при слиянии,
								приобретении или продаже компании (ваши данные могут быть
								переданы новому владельцу).
							</li>
						</ul>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							7. Ваши права
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Вы обладаете следующими правами в отношении своих данных:
						</p>
						<ul className='list-disc list-inside text-gray-300 space-y-3 mt-4'>
							<li>
								<strong>Доступ:</strong> запросить копию своих данных в удобном
								формате.
							</li>
							<li>
								<strong>Исправление:</strong> обновить неточные или неполные
								данные через настройки профиля.
							</li>
							<li>
								<strong>Удаление:</strong> запросить удаление данных (за
								исключением случаев, предусмотренных законом).
							</li>
							<li>
								<strong>Ограничение обработки:</strong> ограничить использование
								данных для определённых целей.
							</li>
							<li>
								<strong>Отказ от маркетинга:</strong> отказаться от получения
								рекламных материалов.
							</li>
							<li>
								<strong>Подача жалобы:</strong> обратиться в регулирующий орган
								по защите данных.
							</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Чтобы воспользоваться своими правами, свяжитесь с нами через
							указанные ниже контакты.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							8. Изменения в политике конфиденциальности
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Мы можем обновлять эту политику для отражения изменений в наших
							практиках или законодательстве. Обновления будут публиковаться на
							этой странице с указанием даты вступления в силу. Мы уведомим вас
							об значительных изменениях через email или уведомления в
							приложении. Продолжение использования приложения после обновления
							означает ваше согласие с новой версией.
						</p>
						<p className='text-gray-300 mt-4'>
							Дата последнего обновления: 07 марта 2025 года.
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							9. Юридическая информация
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							FinanceTracker управляется компанией [Ваше название компании],
							зарегистрированной по адресу [адрес компании]. Настоящая политика
							регулируется законодательством [страна/регион]. Любые споры будут
							разрешаться в суде [название суда/юрисдикция].
						</p>
					</section>
					<section>
						<h2 className='text-3xl font-semibold text-gray-100 mb-4'>
							10. Связь с нами
						</h2>
						<p className='text-gray-300 leading-relaxed'>
							Если у вас есть вопросы, замечания или запросы, связанные с этой
							политикой или обработкой ваших данных, пожалуйста, свяжитесь с
							нами:
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
								<strong>Телефон:</strong> +1-800-555-0123 (доступно в рабочее
								время)
							</li>
							<li>
								<strong>Адрес:</strong> 123 Финансовая улица, Город, Страна
							</li>
						</ul>
						<p className='text-gray-300 mt-4'>
							Мы ответим в течение 30 дней с момента получения вашего запроса.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Privacy;
