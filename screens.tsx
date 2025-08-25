import React, { useState, useEffect, useRef } from 'react';
import { useActionHandler } from './hooks.tsx';
import type { UserData } from './types.ts';
import { 
    Header, Stories, InfoCards, QuickActions, AccountCard, PlusIcon,
    ChatSearchIcon, ChatCreateIcon, UserEditModal
} from './components.tsx';

export const LoginScreen: React.FC<{ onLogin: (email: string, pass: string) => void, error: string }> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="login-screen">
            <h1>T-Bank</h1>
            <p>Войдите в свой аккаунт</p>
            <form onSubmit={handleSubmit} className="login-form">
                <input className="modal-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="modal-input" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="modal-button">Войти</button>
            </form>
        </div>
    );
};

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
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    
    const internalOnAction = (action: string) => {
        if (action.startsWith('Открыть') || action === 'Между счетами' || action === 'Перевести по телефону') {
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
    
    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <>
            <Header userData={userData} onProfileClick={onProfileClick} isProfileOpen={isProfileOpen} onAction={internalOnAction} />
            <main>
                <Stories onAction={internalOnAction} />
                <InfoCards partners={userData.cashbackPartners} progress={userData.cashbackProgress} spending={userData.monthlySpending} onHistoryClick={onHistoryClick} onAction={internalOnAction} />
                <QuickActions onAction={onAction} />
                <div className="accounts-list">
                    {userData.accounts.map((acc, index) => (
                         <div
                            key={acc.id}
                            className="account-card-wrapper"
                            draggable={userData.isPremium}
                            onDragStart={(e) => {
                                if (!userData.isPremium) return;
                                dragItem.current = index;
                                e.currentTarget.classList.add('dragging');
                            }}
                            onDragEnter={() => {
                                if (!userData.isPremium) return;
                                dragOverItem.current = index;
                            }}
                            onDragEnd={(e) => {
                                if (!userData.isPremium) return;
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

export const PaymentsScreen: React.FC<{onAction: (action: string) => void}> = ({ onAction }) => {
    const handleAction = useActionHandler();
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <header className="payments-header">
                <h1>Платежи</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Поиск" onClick={() => handleAction('Поиск по платежам')} />
                </div>
            </header>
            <main>
                <section className={`section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '150ms' }}>
                    <div className="section-header">
                        <h2 className="section-title">Переводы</h2>
                        <a onClick={() => handleAction('Все переводы')} className="section-action">Все</a>
                    </div>
                    <div className="service-grid">
                        <div className="service-item" onClick={() => onAction('Перевести по телефону')}><div className="service-icon"></div><span>По телефону</span></div>
                        <div className="service-item" onClick={() => onAction('Между счетами')}><div className="service-icon"></div><span>Между счетами</span></div>
                        <div className="service-item" onClick={() => onAction('По номеру карты')}><div className="service-icon"></div><span>По номеру карты</span></div>
                    </div>
                </section>
                {/* Other sections can be added here */}
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

export const AdminScreen: React.FC<{users: UserData[], onUserUpdate: (updatedUser: UserData) => void}> = ({ users, onUserUpdate }) => {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    return (
        <>
            <header className="payments-header">
                <h1>Админ-панель</h1>
            </header>
            <main>
                <div className="section">
                    <h2 className="section-title">Пользователи</h2>
                    <div className="contact-list" style={{marginTop: '16px'}}>
                        {users.map(user => (
                            <div key={user.email} className="contact-item" onClick={() => setSelectedUser(user)} style={{cursor: 'pointer'}}>
                                 <div className="avatar" style={{backgroundImage: `url(${user.avatarUrl})`}}></div>
                                 <div className="contact-item-info">
                                    <div className="contact-item-name">{user.name}</div>
                                    <p style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{user.email}</p>
                                 </div>
                                 {user.frozen && <span style={{color: 'var(--notification-red)', fontWeight: '600'}}>FROZEN</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            {selectedUser && (
                <UserEditModal 
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    user={selectedUser}
                    onSave={onUserUpdate}
                />
            )}
        </>
    );
};