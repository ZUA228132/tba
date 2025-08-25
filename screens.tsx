import React, { useState, useEffect, useRef } from 'react';
import { useActionHandler } from './hooks.tsx';
import type { UserData } from './types.ts';
import { 
    Header, Stories, InfoCards, QuickActions, AccountCard, PlusIcon,
    ChatSearchIcon, ChatCreateIcon
} from './components.tsx';

export const MainScreen: React.FC<{ 
    userData: UserData; 
    setUserData: React.Dispatch<React.SetStateAction<UserData>>; 
    onProfileClick: () => void; 
    isProfileOpen: boolean;
    onHistoryClick: () => void;
    onAction: (action: string) => void;
}> = ({ userData, setUserData, onProfileClick, isProfileOpen, onHistoryClick, onAction }) => {
    const handleGenericAction = useActionHandler();
    const [isAnimated, setIsAnimated] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const mainRef = useRef<HTMLElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    
    const internalOnAction = (action: string) => {
        if (action.startsWith('Открыть карту') || action === 'Между счетами' || action === 'Перевести по телефону') {
            onAction(action);
        } else {
            handleGenericAction(action);
        }
    };


    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            return;
        }

        const accountsCopy = [...userData.accounts];
        const draggedItemContent = accountsCopy.splice(dragItem.current, 1)[0];
        accountsCopy.splice(dragOverItem.current, 0, draggedItemContent);
        setUserData(prev => ({ ...prev, accounts: accountsCopy }));
    };

    const triggerAnimation = () => {
        setIsAnimated(false);
        setTimeout(() => setIsAnimated(true), 50);
    };
    
    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);
    
    const handleRefresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setTimeout(() => {
            triggerAnimation();
            setIsRefreshing(false);
        }, 1500);
    };

    return (
        <>
            <Header userData={userData} onProfileClick={onProfileClick} isProfileOpen={isProfileOpen} onAction={internalOnAction} />
            <main ref={mainRef}>
                <Stories onAction={internalOnAction} />
                <InfoCards partners={userData.cashbackPartners} progress={userData.cashbackProgress} onHistoryClick={onHistoryClick} onAction={internalOnAction} />
                <QuickActions onAction={internalOnAction} />
                <div className="accounts-list">
                    {userData.accounts.map((acc, index) => (
                         <div
                            key={acc.id}
                            className="account-card-wrapper"
                            draggable
                            onDragStart={(e) => {
                                dragItem.current = index;
                                e.currentTarget.classList.add('dragging');
                            }}
                            onDragEnter={() => {
                                dragOverItem.current = index;
                            }}
                            onDragEnd={(e) => {
                                e.currentTarget.classList.remove('dragging');
                                handleSort();
                                dragItem.current = null;
                                dragOverItem.current = null;
                            }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <AccountCard account={acc} isAnimated={isAnimated} animationIndex={index} onAction={internalOnAction} />
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export const PaymentsScreen = () => {
    const handleAction = useActionHandler();
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const favorites = [
        { label: 'Долгосроч. сбережения', icon: <div/> }, { label: 'Ксения К.', icon: <div/> },
        { label: 'Мобила', icon: <div/> }, { label: 'Добавить', icon: <PlusIcon /> },
    ];
    const contacts = [
        { name: 'Себе', initials: 'С' }, { name: 'Настёна', initials: 'Н' },
        { name: '+7 980 908', initials: '?' }, { name: 'Андрей Госов', initials: 'АГ' },
        { name: 'Арт Бори', initials: 'АБ' },
    ];
    const transfers = [
        { label: 'Из другого банка', icon: <div/> }, { label: 'Между счетами', icon: <div/> },
        { label: 'По номеру карты', icon: <div/> }, { label: 'По договору', icon: <div/> },
    ];
    const payments = [
        { label: 'Мобильная связь', icon: <div/> }, { label: 'ЖКХ', icon: <div/> },
        { label: 'Госуслуги', icon: <div/> }, { label: 'Погашение кредита', icon: <div/> },
    ];

    return (
        <>
            <header className="payments-header">
                <h1>Платежи</h1>
                <div className="search-bar">
                    {/* <SearchIcon /> */}
                    <input type="text" placeholder="Поиск" onClick={() => handleAction('Поиск по платежам')} />
                </div>
            </header>
            <main>
                <section className={`section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '50ms' }}>
                    <div className="section-header"><h2 className="section-title">Избранное</h2></div>
                    <div className="horizontal-scroll">
                        {favorites.map(fav => (
                            <a key={fav.label} onClick={() => handleAction(fav.label)} className="favorite-item">
                                <div className="favorite-icon">{fav.icon}</div>
                                <span className="favorite-label">{fav.label}</span>
                            </a>
                        ))}
                    </div>
                </section>
                <div className={`payment-quick-actions ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '100ms', opacity: 0, animation: 'fadeInUp 0.5s forwards' }}>
                    <a onClick={() => handleAction('На оплату')} className="payment-action-btn"><div/> На оплату</a>
                    <a onClick={() => handleAction('Сканировать QR')} className="payment-action-btn"><div/> Сканировать</a>
                </div>
                <section className={`section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '150ms' }}>
                    <div className="section-header">
                        <h2 className="section-title">Перевод по телефону</h2>
                        <a onClick={() => handleAction('Открыть контакты')} className="section-action"><div/></a>
                    </div>
                    <div className="phone-transfer-input">
                        {/* <PhoneIcon /> */}
                        <input type="text" placeholder="Имя или номер" />
                    </div>
                    <div className="horizontal-scroll">
                        {contacts.map(c => (
                            <div key={c.name} className="contact-bubble" onClick={() => handleAction(`Перевести для "${c.name}"`)}>
                                <div className="contact-avatar">{c.initials === '?' ? c.name.slice(0, 1) : c.initials}</div>
                                <div className="contact-name">{c.name}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className={`section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '200ms' }}>
                    <div className="section-header">
                        <h2 className="section-title">Переводы</h2>
                        <a onClick={() => handleAction('Все переводы')} className="section-action">Все</a>
                    </div>
                    <div className="service-grid">
                        {transfers.map(item => (
                            <div key={item.label} className="service-item" onClick={() => handleAction(item.label)}>
                                <div className="service-icon">{item.icon}</div>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
                 <section className={`section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '250ms' }}>
                    <div className="section-header">
                        <h2 className="section-title">Платежи</h2>
                        <a onClick={() => handleAction('Все платежи')} className="section-action">Все</a>
                    </div>
                    <div className="service-grid">
                        {payments.map(item => (
                            <div key={item.label} className="service-item" onClick={() => handleAction(item.label)}>
                                <div className="service-icon">{item.icon}</div>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section className={`section single-action-section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '300ms' }}>
                     <div className="single-action-btn" onClick={() => handleAction('Запросить деньги')}>
                        <div className="service-icon"><div/></div>
                        <span>Запросить деньги</span>
                    </div>
                </section>
            </main>
        </>
    );
};

export const ChatScreen = () => {
    const handleAction = useActionHandler();
    const chatData = [
      { id: 1, avatarUrl: 'https://i.imgur.com/your_image_url.png', title: 'Сегодня в Городе', message: 'Не прощаемся с летом Приходите танцевать', time: 'СБ', unread: 1, icon: <svg viewBox="0 0 24 24"><path fill="#FBC02D" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>, iconBg: '#FFF9C4' },
      { id: 2, avatarUrl: 'https://i.imgur.com/your_image_url.png', title: 'Поддержка', message: 'Здравствуйте Фото заявления', time: 'ПТ', unread: 1, icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 8C0 3.58172 3.58172 0 8 0H20C24.4183 0 28 3.58172 28 8V20C28 24.4183 24.4183 28 20 28H8C3.58172 28 0 24.4183 0 20V8Z" fill="#FFDD2D"/><path d="M7 14H21V16H7V14Z" fill="#000"/></svg>, iconBg: '#FFDD2D' },
      { id: 3, avatarUrl: 'https://i.imgur.com/your_image_url.png', title: 'Деньги на важное', message: 'Ваша заявка на кредитку не была одобрена. К со...', time: '18.08', unread: 0, icon: <svg viewBox="0 0 24 24"><path fill="#E57373" d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/></svg>, iconBg: '#FFCDD2' },
      { id: 4, avatarUrl: 'https://i.imgur.com/9Kkz2aN.png', title: 'Выгода от Т-Банка', message: 'Готовимся к школе 📚 Собрали подборку с кэшб...', time: '14.08', unread: 0 },
      { id: 5, avatarUrl: 'https://i.imgur.com/4S0At8P.png', title: 'T-Pay', message: 'Ко Дню огурца выпустили стикер Т-Рау — в фор...', time: '10.08', unread: 0 },
      { id: 6, avatarUrl: 'https://i.imgur.com/Kknun7o.png', title: 'Питерский выходной', message: '🖼️ В музей за счет Т-Банка', time: '22.07', unread: 0 },
      { id: 7, avatarUrl: 'https://i.imgur.com/1B9aPBh.png', title: '5 букв', message: 'Новый розыгрыш в «5 буквах» Награды по-летне...', time: '19.07', unread: 0 },
    ];
  
    return (
      <>
        <header className="chat-header">
          <h1>Чат</h1>
          <div className="chat-header-actions">
              <button onClick={() => handleAction('Поиск по чатам')}><ChatSearchIcon /></button>
              <button onClick={() => handleAction('Создать чат')}><ChatCreateIcon /></button>
          </div>
        </header>
        <main style={{padding: '0'}}>
          <div className="chat-list section">
            {chatData.map(chat => (
              <div key={chat.id} className="chat-item" onClick={() => handleAction(`Открыть чат: ${chat.title}`)}>
                <div className="chat-avatar" style={{ backgroundColor: chat.iconBg }}>
                  {chat.icon ? chat.icon : <img src={chat.avatarUrl} alt={chat.title}/> }
                </div>
                <div className="chat-content">
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-message">{chat.message}</div>
                </div>
                <div className="chat-info">
                  <div className="chat-time">{chat.time}</div>
                  {chat.unread > 0 && <div className="chat-unread-badge">{chat.unread}</div>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </>
    );
  };