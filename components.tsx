import React, { useEffect, useContext, createContext, useState } from 'react';
import type { Toast, ToastContextType, MiniCardData, TabName } from './types.ts';

// --- TOAST NOTIFICATION SYSTEM ---
const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string) => setToasts(prev => [...prev, { id: Date.now(), message }]);
  const removeToast = (id: number) => setToasts(prev => prev.filter(toast => toast.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context.addToast;
};

const ToastMessage: React.FC<{ toast: Toast, removeToast: (id: number) => void }> = ({ toast, removeToast }) => {
    useEffect(() => {
        const timer = setTimeout(() => removeToast(toast.id), 3000);
        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);
    return <div className="toast-message">{toast.message}</div>;
};

const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: number) => void }> = ({ toasts, removeToast }) => (
    <div className="toast-container">
      {toasts.map(toast => <ToastMessage key={toast.id} toast={toast} removeToast={removeToast} />)}
    </div>
);


// --- SVG ICON COMPONENTS ---
export const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.294 14.706a8 8 0 111.414-1.414l4.99 5a1 1 0 01-1.414 1.414l-4.99-5zM10 16a6 6 0 100-12 6 6 0 000 12z" fill="#858D97"/></svg>;
export const ChevronDownIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const TransferIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 6v3h-3v2h3v3l4-4-4-4zm-4 5H7V9l-4 4 4 4v-3h3v-2z"/></svg>;
export const TopUpIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1 12H9v-4H7l4-5 4 5h-2v4h-2v-4z" opacity=".3"/><path fill="currentColor" d="M11 16h2v-4h2l-4-5-4 5h2z"/></svg>;
export const BetweenAccountsIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 17H7v-3l-4 4 4 4v-3h12v-2zm-2-11H5v3l-4-4 4-4v3h12v2z"/></svg>;
export const QRIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 8h8v-8h-8v8zm2-6h4v4h-4v-4z"/></svg>;
export const RubleIcon = () => <svg viewBox="0 0 24 24"><path fill="white" d="M13.5 11.5c1.1 0 2-.9 2-2s-.9-2-2-2h-3v4h3zm0 1h-3v2.5H9V18h1.5v1h2v-1H14c1.1 0 2-.9 2-2s-.9-2-2-2zM6 3h9c2.2 0 4 1.8 4 4s-1.8 4-4 4h-2.5v2H14c2.2 0 4 1.8 4 4s-1.8 4-4 4H6v-2h9c1.1 0 2-.9 2-2s-.9-2-2-2h-2.5v-2H9c-1.1 0-2-.9-2-2s.9-2 2-2h2.5V5H6V3z"/></svg>;
export const ThreeDotsIcon = () => <svg viewBox="0 0 24 24" fill="white"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>;
export const TinkoffIcon = () => <svg viewBox="0 0 24 24" fill="#FDD900"><path d="M20.9 6.95v-.17c0-1.1-.9-2-2-2h-1.45l-3.37 4.1-.73-4.1h-1.45v10.4h1.94v-6.23l4.13 6.23h1.94V6.95zM4.14 15.18V4.78h7.94v1.44H6.08v3.08h5.2v1.44h-5.2v4.44h-1.94z"/></svg>;
export const MobileIcon = () => <svg viewBox="0 0 24 24" fill="#4991F8"><path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/></svg>;
export const PlusIcon = () => <svg viewBox="0 0 24 24" fill="#4991F8"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
export const BillIcon = () => <svg viewBox="0 0 24 24" fill="#4991F8"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2z"/></svg>;
export const PhoneIcon = () => <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.74-.25 1.02l-2.2 2.2z"></path></svg>;
export const ArrowRightIcon = () => <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"></path></svg>;
export const FromBankIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v2h20V7L12 2zM6 10v7h3v-7H6zm5 0v7h3v-7h-3zm5 0v7h3v-7h-3zM2 22h20v-2H2v2z"/></svg>;
export const ByCardNumberIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;
export const ByContractIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
export const HousingIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
export const GovServicesIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7.27l5.22 3.32v6.98l-5.22 3.32-5.22-3.32V10.59l5.22-3.32M12 2L3 8v8l9 6 9-6V8l-9-6z"/></svg>;
export const CreditIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"/></svg>;
export const RequestMoneyIcon = () => <svg viewBox="0 0 24 24" fill="#4991F8"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>;
export const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>;


// --- UI COMPONENTS ---
export const Header: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => (
    <header className="app-header">
      <div className="user-profile">
        <div className="avatar"></div>
        <div className="user-name">Артем <ChevronDownIcon /></div>
      </div>
      <div className="search-bar">
        <SearchIcon />
        <input type="text" placeholder="Поиск" onClick={() => onAction('Открыть поиск')}/>
      </div>
    </header>
);

export const Stories: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => (
    <section className="stories-section">
      <div className="story-card story-card-1" onClick={() => onAction('Смотреть историю 1')}><span>Обезьянки на прогулке</span></div>
      <div className="story-card story-card-2" onClick={() => onAction('Смотреть историю 2')}><span>Как эффективно работать</span></div>
    </section>
);

export const InfoCards: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => (
    <section className="info-cards-section">
        <div className="info-card" onClick={() => onAction('Перейти к операциям')}>
            <h3>Все операции</h3>
            <p className="amount">Трат в августе 339 708 ₽</p>
            <div className="progress-bar">
                <div style={{ width: '40%', backgroundColor: '#8E44AD' }}></div>
                <div style={{ width: '30%', backgroundColor: '#3498DB' }}></div>
                <div style={{ width: '20%', backgroundColor: '#F1C40F' }}></div>
                <div style={{ width: '10%', backgroundColor: '#E74C3C' }}></div>
            </div>
        </div>
        <div className="info-card" onClick={() => onAction('Перейти к бонусам')}>
            <h3>Кэшбэк и бонусы</h3>
            <div className="bonus-logos">
                <img src="https://acdn.tinkoff.ru/static/documents/ae25d625-b829-478e-8a2b-160a0f058088.svg" alt="Ozon" />
                <img src="https://acdn.tinkoff.ru/static/documents/0a282bc7-4c3e-4228-a5b6-7f871578536f.svg" alt="Yandex" />
                <img src="https://acdn.tinkoff.ru/static/documents/6c53d1e3-3b60-4660-823d-4c31d5f2f516.svg" alt="Aviasales" />
            </div>
        </div>
    </section>
);

export const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
    const actions = [
        { label: 'Перевести по телефону', icon: <TransferIcon />, color: '#ECF4FE' },
        { label: 'Пополнить', icon: <TopUpIcon />, color: '#E8F5E9' },
        { label: 'Между счетами', icon: <BetweenAccountsIcon />, color: '#F3E5F5' },
        { label: 'Сканировать QR-код', icon: <QRIcon />, color: '#FFF3E0' },
    ];
    return (
        <section className="quick-actions">
            {actions.map(action => (
                <a onClick={() => onAction(action.label)} className="action-button" key={action.label}>
                    <div className="icon-wrapper" style={{ backgroundColor: action.color }}>{action.icon}</div>
                    {action.label}
                </a>
            ))}
        </section>
    );
};

export const MiniCard: React.FC<{ card: MiniCardData, isAnimated: boolean, animationIndex: number }> = ({ card, isAnimated, animationIndex }) => (
    <div className={`mini-card mini-card-${card.type} ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: `${200 + animationIndex * 100}ms` }}>
      {card.last4}
    </div>
);

export const AccountCard: React.FC<{ account: any, miniCards?: MiniCardData[], isAnimated: boolean, animationIndex: number, onAction: (action: string) => void }> = ({ account, miniCards, isAnimated, animationIndex, onAction }) => (
    <div 
        className={`account-card ${account.main ? 'main-account' : ''} ${isAnimated ? 'animate-in' : ''}`}
        style={{ animationDelay: `${animationIndex * 75}ms` }}
        onClick={() => onAction(`Открыть счет "${account.name}"`)}
    >
        <div className="account-icon" style={{ backgroundColor: account.iconBg }}>
            {account.icon}
        </div>
        <div className="account-details">
            <div className="account-info-left">
                <span className="account-name">{account.name}</span>
                {account.main && <div className="mini-cards">{miniCards?.map((c, i) => <MiniCard key={c.id} card={c} isAnimated={isAnimated} animationIndex={i} />)}</div>}
            </div>
             <div className="account-info-right">
                <span className="account-balance">{account.balance}</span>
                {account.badge && <span className="notification-badge">{account.badge}</span>}
            </div>
        </div>
    </div>
);

export const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: '80px' }}>
        <h1 style={{textTransform: 'capitalize', color: '#858D97'}}>{title}</h1>
    </main>
);

export const BottomNav: React.FC<{ activeTab: TabName, setActiveTab: (tab: TabName) => void }> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'main', label: 'Главная', icon: <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg> },
        { id: 'payments', label: 'Платежи', icon: <svg viewBox="0 0 24 24"><path d="M18 4H6C3.79 4 2 5.79 2 8v8c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-1 14H7c-1.1 0-2-.9-2-2V9h12v7c0 1.1-.9 2-2 2zm1-9H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v1z"></path></svg> },
        { id: 'city', label: 'Город', icon: <svg viewBox="0 0 24 24"><path d="m12 2-5.5 9h11z"></path><path d="M17.5 13H20v7h-2.5zM4 20h2.5v-7H4zM10.5 20h3v-7h-3z"></path></svg> },
        { id: 'chat', label: 'Чат', icon: <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg> },
        { id: 'more', label: 'Ещё', icon: <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg> },
    ];
    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                 <div key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id as TabName)}>
                    {item.id === 'chat' && <div className="nav-notification">2</div>}
                    {item.icon}
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
};