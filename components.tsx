import React, { useEffect, useContext, createContext, useState, useRef } from 'react';
import type { Toast, ToastContextType, TabName, UserData, Card, Account, CashbackPartner, FavoriteContact, Bank, Transaction, TransactionCategory } from './types.ts';

// --- UTILS ---
const formatContactName = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 1) {
        return `${parts[0]} ${parts[1][0]}.`;
    }
    return fullName;
};

// --- DATA ---
const cardDesigns = [
    'https://i.imgur.com/P8Cp1y6.jpeg', // Airlanes
    'https://i.imgur.com/QWaK5r7.jpeg', // Alliexpress
    'https://i.imgur.com/Z6uwYH7.jpeg', // Black
    'https://i.imgur.com/jznOaL1.jpeg'  // Platinum
];
const cashbackIcons = [
    'https://i.imgur.com/uplZIqA.png',
    'https://i.imgur.com/EzmYEEI.png',
    'https://i.imgur.com/bGshFAV.png'
];
export const allBanks: Bank[] = [
    { id: 't-bank', name: 'Т-Банк', logoUrl: 'https://336118.selcdn.ru/Gutsy-Culebra/products/T-Bank-Seller-Logo.png', gradient: 'linear-gradient(135deg, #FFDD2D 0%, #F5C62C 100%)' },
    { id: 'sber', name: 'Сбербанк', logoUrl: 'https://i.imgur.com/ZXP1II7.jpeg', gradient: 'linear-gradient(135deg, #22A04E 0%, #1A7E3E 100%)' },
    { id: 'alfa', name: 'Альфа-Банк', logoUrl: 'https://i.imgur.com/bSgAAx7.png', gradient: 'linear-gradient(135deg, #EF3124 0%, #D71921 100%)' },
    { id: 'yandex', name: 'Яндекс Банк', logoUrl: 'https://i.imgur.com/tKjl6rH.png', gradient: 'linear-gradient(135deg, #f9e154 0%, #f6c045 100%)' },
    { id: 'youmoney', name: 'ЮMoney', logoUrl: 'https://play-lh.googleusercontent.com/9nfp-5pj5fsdt2j2v6x2peq5j_L3M55ckL4SGq5s9D3-86GRtKk20_1G52Lbt75p2uM', gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)' },
    { id: 'other', name: 'Другой банк', logoUrl: 'https://w7.pngwing.com/pngs/904/418/png-transparent-computer-icons-bank-finance-bank-angle-building-text.png', gradient: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)' },
];


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
export const PlusIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const RubleIconWhite = () => <svg width="24" height="24" viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M384 32H224c-53.02 0-96 42.98-96 96v32h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32v64h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32v128h64V352h48c53.02 0 96-42.98 96-96s-42.98-96-96-96h-48V128c0-17.64 14.36-32 32-32h96c17.67 0 32-14.33 32-32S401.7 32 384 32zM288 160v64h-64v-64H288z"/></svg>;
export const ThreeDotsIcon = () => <svg viewBox="0 0 24 24" fill="white"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>;
export const TransfersIcon = () => <svg viewBox="0 0 24 24" fill="white"><path d="M20 18v-2h-8v2h8zm-8-3.5h8v-2h-8v2zM4 14.5v-11h14v11h-2V7H6v5.5H4z"/></svg>;
export const BackIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>;
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;
const BlockIcon = () => <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>;
const ReissueIcon = () => <svg viewBox="0 0 24 24"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"></path></svg>;
const FreezeIcon = () => <svg viewBox="0 0 24 24"><path d="M19 5h-2V4c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM9 4h6v1H9V4zm5.5 11.5L12 13.72 9.5 15.5l.96-2.88L8 10.41l2.9-.25L12 7.5l1.1 2.66 2.9.25-2.46 2.21L14.5 15.5z"></path></svg>;
const FoodIcon = () => <svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>;
const ShoppingIcon = () => <svg viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h12v12z"/></svg>;
const TransportIcon = () => <svg viewBox="0 0 24 24"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.02-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.2 6.45 8 5.25 8 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>;
const HealthIcon = () => <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6v-3h12v3zm0-5H6V8h12v6z"/></svg>;
const IncomeIcon = () => <svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>;
export const TopUpIcon = () => <svg color="#4986CC" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false"><defs><linearGradient id="dsId_J2L57baxsI0_linear_1525_512" x1="5" y1="5" x2="19" y2="19" gradientUnits="userSpaceOnUse"><stop stop-opacity=".95" stop-color="currentColor"></stop><stop offset="1" stop-opacity=".65" stop-color="currentColor"></stop></linearGradient></defs><path fill-rule="evenodd" clip-rule="evenodd" d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Zm5.514-10.5a1 1 0 0 1-1 1h-3v4h-2a1 1 0 0 1-1-1v-3h-4v-2a1 1 0 0 1 1-1h3v-4h2a1 1 0 0 1 1 1v3h4v2Z" fill="url(#dsId_J2L57baxsI0_linear_1525_512)"></path></svg>;
export const NewBetweenAccountsIcon = () => <svg color="#4986CC" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false"><defs><linearGradient id="dsId_4ogCu8R6HB0_linear_1524_1496" x1="21" y1="15.5" x2="6.263" y2="15.5" gradientUnits="userSpaceOnUse"><stop stop-opacity=".5" stop-color="currentColor"></stop><stop offset="1" stop-opacity=".4" stop-color="currentColor"></stop></linearGradient></defs><path opacity=".95" fill-rule="evenodd" clip-rule="evenodd" d="M15 5V0l9 8.5-9 8.5v-5H9V7l-4.13 3.9A4.99 4.99 0 0 1 3 7V5h12Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9 19v5l-9-8.5L9 7v5h6v5l4.13-3.9A4.99 4.99 0 0 1 21 17v2H9Z" fill="url(#dsId_4ogCu8R6HB0_linear_1524_1496)"></path></svg>;
export const NewQRIcon = () => <svg color="#4986CC" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 1h5v.5C6 2.3 5.3 3 4.5 3H3v1c0 .8-.7 1.5-1.5 1.5H1V1ZM1 23h5v-.5c0-.8-.7-1.5-1.5-1.5H3v-1c0-.8-.7-1.5-1.5-1.5H1V23ZM23 1h-5v.5c0 .8.7 1.5 1.5 1.5H21v1c0 .8.7 1.5 1.5 1.5h.5V1ZM23 23h-5v-.5c0-.8.7-1.5 1.5-1.5H21v-1c0-.8.7-1.5-1.5-1.5h.5V23ZM13.4 13.4V5H5v8.4h8.4Zm-2.1-2.1V7.1H7.1v4.2h4.2Z" fill="currentColor"></path><path d="M9.97 8.43v1.54H8.43V8.43h1.54Z" fill="currentColor"></path><path opacity=".85" fill-rule="evenodd" clip-rule="evenodd" d="M15.5 5H19V11.3h-3.5V9.2h1.75V7.1H15.5V5ZM5 19h2.1v-1.75h2.1V19h2.1v-3.5H5V19Z" fill="currentColor" fill-opacity=".9"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19 19v-5.6h-5.6V19H19Zm-1.96-1.96v-1.68h-1.68v1.68h1.68Z" fill="currentColor"></path></svg>;
export const ChatSearchIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
export const ChatCreateIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;


const TransactionIcon: React.FC<{ category: TransactionCategory }> = ({ category }) => {
    switch (category) {
        case 'food': return <FoodIcon />;
        case 'shopping': return <ShoppingIcon />;
        case 'transport': return <TransportIcon />;
        case 'health': return <HealthIcon />;
        case 'income': return <IncomeIcon />;
        default: return null;
    }
};


// --- UI COMPONENTS ---
export const Header: React.FC<{ userData: UserData; onProfileClick: () => void; isProfileOpen: boolean; onAction: (action: string) => void }> = ({ userData, onProfileClick, isProfileOpen, onAction }) => (
    <header className="app-header">
      <div className="user-profile" onClick={onProfileClick}>
        <div className="avatar" style={{ backgroundImage: `url(${userData.avatarUrl})` }}></div>
        <div className={`user-name ${isProfileOpen ? 'open' : ''}`}>{userData.name} <ChevronDownIcon /></div>
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

export const InfoCards: React.FC<{ partners: CashbackPartner[], progress: { color: string, percentage: number }[], onHistoryClick: () => void, onAction: (action: string) => void }> = ({ partners, progress, onHistoryClick, onAction }) => (
    <section className="info-cards-section">
        <div className="info-card" onClick={onHistoryClick}>
            <h3>Все операции</h3>
            <p className="amount">Трат в августе 339 708 ₽</p>
            <div className="progress-bar">
                {progress.map((p, i) => <div key={i} style={{ width: `${p.percentage}%`, backgroundColor: p.color }}></div>)}
            </div>
        </div>
        <div className="info-card" onClick={() => onAction('Перейти к бонусам')}>
            <h3>Кэшбэк и бонусы</h3>
            <div className="bonus-logos">
                {partners.map(p => <img key={p.id} src={p.logoUrl} alt="bonus" />)}
            </div>
        </div>
    </section>
);

export const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
    const actions = [
        { label: 'Перевести по телефону', icon: <img src="https://i.imgur.com/29F5tp2.png" alt="transfer"/>, className: 'action-button-transfer' },
        { label: 'Пополнить', icon: <TopUpIcon /> },
        { label: 'Между счетами', icon: <NewBetweenAccountsIcon /> },
        { label: 'Сканировать QR-код', icon: <NewQRIcon /> },
    ];
    return (
        <section className="quick-actions">
            {actions.map(action => (
                <a onClick={() => onAction(action.label)} className={`action-button ${action.className || ''}`} key={action.label}>
                    <div className="icon-wrapper">{action.icon}</div>
                    <span>{action.label}</span>
                </a>
            ))}
        </section>
    );
};

export const CardCarousel: React.FC<{ account: Account, onAction: (action: string) => void }> = ({ account, onAction }) => (
    <div className="card-carousel">
        {account.cards.map(card => (
            <div key={card.id} className="card-carousel-item" onClick={() => onAction(`Открыть карту ${account.id}/${card.id}`)}>
                <img src={account.cardDesignUrl!} alt="Bank Card" />
            </div>
        ))}
    </div>
);

const AccountIconRenderer: React.FC<{ iconName: string }> = ({ iconName }) => {
    if (iconName.startsWith('http')) {
        return <img src={iconName} alt="account icon"/>;
    }
    switch(iconName) {
        case 'ruble': return <RubleIconWhite />;
        case 'transfers': return <TransfersIcon />;
        case 'three-dots': return <ThreeDotsIcon />;
        default: return <RubleIconWhite />;
    }
};

export const AccountCard: React.FC<{ account: Account, isAnimated: boolean, animationIndex: number, onAction: (action: string) => void }> = ({ account, isAnimated, animationIndex, onAction }) => (
    <div 
        className={`account-card ${account.main ? 'main-account' : ''} ${isAnimated ? 'animate-in' : ''}`}
        style={{ animationDelay: `${animationIndex * 75}ms` }}
        onClick={() => onAction(`Открыть счет "${account.name}"`)}
    >
        <div className="account-icon" style={{ backgroundColor: account.iconBg }}>
            <AccountIconRenderer iconName={account.iconName} />
        </div>
        <div className="account-details">
            <div className="account-info-left">
                <span className="account-name">{account.name}</span>
                {account.main && account.cards.length > 0 && account.cardDesignUrl &&
                    <CardCarousel account={account} onAction={onAction} />
                }
            </div>
             <div className="account-info-right">
                <span className="account-balance">{account.balance.toLocaleString('ru-RU')} ₽</span>
                {account.badge && <span className="notification-badge" style={{ backgroundColor: account.badge.color }}>{account.badge.text}</span>}
            </div>
        </div>
    </div>
);

const AddContactForm: React.FC<{ onSave: (contact: Omit<FavoriteContact, 'id' | 'initials'>) => void, onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<Bank[]>([]);

    const toggleBank = (bank: Bank) => {
        setSelectedBanks(prev => 
            prev.find(b => b.id === bank.id) 
            ? prev.filter(b => b.id !== bank.id)
            : [...prev, bank]
        );
    };

    const handleSave = () => {
        onSave({ name, phone, banks: selectedBanks });
    };

    return (
        <div className="modal-section">
            <h3 className="modal-title">Новый контакт</h3>
            <div className="input-group" style={{gap: '12px'}}>
                <input type="text" placeholder="ФИО" value={name} onChange={e => setName(e.target.value)} />
                <input type="tel" placeholder="Номер телефона" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <h4 style={{fontSize: '14px', fontWeight: 500, margin: '16px 0 8px 0'}}>Банки контакта</h4>
            <div className="grid-selector" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '12px'}}>
                {allBanks.map(bank => (
                    <div key={bank.id} className={`grid-item bank-logo ${selectedBanks.find(b => b.id === bank.id) ? 'selected' : ''}`} onClick={() => toggleBank(bank)} style={{aspectRatio: '1', border: '2px solid transparent', padding: '4px', backgroundColor: '#fff'}}>
                        <img src={bank.logoUrl} alt={bank.name} style={{objectFit: 'contain'}} />
                    </div>
                ))}
            </div>
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                <button className="modal-button" onClick={handleSave} style={{backgroundColor: '#34c759'}}>Сохранить</button>
                <button className="modal-button" onClick={onCancel} style={{backgroundColor: 'var(--text-secondary)'}}>Отмена</button>
            </div>
        </div>
    );
};


export const ProfileModal: React.FC<{ isOpen: boolean, onClose: () => void, userData: UserData, setUserData: React.Dispatch<React.SetStateAction<UserData>> }> = ({ isOpen, onClose, userData, setUserData }) => {
    const [tempName, setTempName] = useState(userData.name);
    const [tempAvatarUrl, setTempAvatarUrl] = useState(userData.avatarUrl);
    const addToast = useToast();
    const [isAddingContact, setIsAddingContact] = useState(false);
    const mainAccount = userData.accounts.find(a => a.main);

    useEffect(() => {
        if (isOpen) {
            setTempName(userData.name);
            setTempAvatarUrl(userData.avatarUrl);
            setIsAddingContact(false);
        }
    }, [userData, isOpen]);

    const handleSaveProfile = () => {
        setUserData(prev => ({ 
            ...prev, 
            name: tempName.trim(),
            avatarUrl: tempAvatarUrl.trim()
        }));
        addToast('Профиль обновлен!');
    };
    
    const handleAccountNameChange = (accountId: number, newName: string) => {
        setUserData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc => acc.id === accountId ? {...acc, name: newName} : acc)
        }));
    };
    
    const handleBadgeChange = (field: 'text' | 'color', value: string) => {
        setUserData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc => {
                if (acc.main && acc.badge) {
                    return {...acc, badge: {...acc.badge, [field]: value}};
                }
                return acc;
            })
        }));
    }

    const handleSetCardDesign = (accountId: number, designUrl: string) => {
        setUserData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc => acc.id === accountId ? { ...acc, cardDesignUrl: designUrl } : acc)
        }));
    };

    const handleAddCard = (accountId: number) => {
        setUserData(prev => {
            const accountToAddCard = prev.accounts.find(a => a.id === accountId);
            if (!accountToAddCard) return prev;
    
            if (accountToAddCard.cards.length >= 5) {
                addToast('Достигнут лимит карт для этого счета');
                return prev;
            }
    
            const designUrl = accountToAddCard.cardDesignUrl || cardDesigns[0]; 
    
            const newCardNumber = '2200 ' + Array.from({ length: 3 }, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
            const newExpiry = `${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${new Date().getFullYear() % 100 + Math.floor(2 + Math.random() * 4)}`;
            const newCvc = String(Math.floor(100 + Math.random() * 900));
    
            const newCard: Card = {
                 id: `card-${Date.now()}`,
                 number: newCardNumber,
                 expiry: newExpiry,
                 cvc: newCvc
            };
    
            const newAccounts = prev.accounts.map(acc => {
                if (acc.id === accountId) {
                    return { ...acc, cardDesignUrl: designUrl, cards: [...acc.cards, newCard] };
                }
                return acc;
            });
    
            addToast('Карта добавлена');
            return { ...prev, accounts: newAccounts };
        });
    };
    
    const handleAddNewAccount = (withCard: boolean) => {
        setUserData(prev => {
            const isFirstAccount = prev.accounts.length === 0;
            const newAccount: Account = {
                id: Date.now(),
                main: isFirstAccount,
                name: "Новый счет",
                balance: 0,
                iconName: 'https://i.imgur.com/8GH7ApO.png',
                iconBg: '#4986CC',
                cards: withCard ? [{
                    id: `card-${Date.now()}`,
                    number: '2200 ' + Array.from({ length: 3 }, () => Math.floor(1000 + Math.random() * 9000)).join(' '),
                    expiry: `${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${new Date().getFullYear() % 100 + 3}`,
                    cvc: String(Math.floor(100 + Math.random() * 900))
                }] : [],
                cardDesignUrl: withCard ? cardDesigns[0] : undefined,
                ...(isFirstAccount && { badge: { text: '129', color: '#FF3B30' } })
            };
            return { ...prev, accounts: [...prev.accounts, newAccount] };
        });
        addToast('Новый счет добавлен!');
    };
    
    const handleSaveContact = (contactData: Omit<FavoriteContact, 'id' | 'initials'>) => {
         if (!contactData.name.trim() || !contactData.phone.trim()) {
            addToast('Введите ФИО и номер телефона');
            return;
        }
        const initials = contactData.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const newContact: FavoriteContact = { ...contactData, id: Date.now(), initials };

         setUserData(prev => ({ ...prev, favoriteContacts: [...prev.favoriteContacts, newContact]}));
         setIsAddingContact(false);
         addToast('Контакт сохранен!');
    };

    const handleDeleteContact = (contactId: number) => {
        setUserData(prev => ({
            ...prev,
            favoriteContacts: prev.favoriteContacts.filter(contact => contact.id !== contactId)
        }));
        addToast('Контакт удален');
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`modal-container ${isOpen ? 'open' : ''}`}>
                <div className="modal-handle"></div>
                <div className="modal-content">
                    <div className="modal-section">
                        <h3 className="modal-title">Профиль</h3>
                        <div className="input-group">
                            <label htmlFor="userName">Ваше имя</label>
                            <input id="userName" type="text" value={tempName} onChange={e => setTempName(e.target.value)} onBlur={handleSaveProfile} />
                        </div>
                        <div className="input-group" style={{marginTop: '12px'}}>
                            <label htmlFor="userAvatar">URL аватара</label>
                            <input id="userAvatar" type="text" value={tempAvatarUrl} onChange={e => setTempAvatarUrl(e.target.value)} onBlur={handleSaveProfile} />
                        </div>
                    </div>
                    
                    {mainAccount?.badge && (
                        <div className="modal-section">
                            <h3 className="modal-title">Настройка бонусов</h3>
                             <div className="input-group">
                                <label>Текст бонуса</label>
                                <input type="text" value={mainAccount.badge.text} onChange={e => handleBadgeChange('text', e.target.value)} />
                            </div>
                            <div className="input-group" style={{marginTop: '12px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px'}}>
                                <label>Цвет бонуса</label>
                                <input type="color" value={mainAccount.badge.color} onChange={e => handleBadgeChange('color', e.target.value)} style={{padding: '4px', height: '40px'}} />
                            </div>
                        </div>
                    )}

                    <div className="modal-section">
                        <h3 className="modal-title">Счета и карты</h3>
                        {userData.accounts.map(acc => (
                            <div key={acc.id} className="section" style={{padding: '12px', marginBottom: '12px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <input 
                                            type="text" 
                                            value={acc.name} 
                                            onChange={(e) => handleAccountNameChange(acc.id, e.target.value)}
                                            style={{fontWeight: 600, border: 'none', background: 'none', fontSize: '16px', padding: 0, color: 'var(--text-primary)'}}
                                        />
                                        <span style={{color: 'var(--text-secondary)', fontSize: '14px'}}>({acc.cards.length} карт)</span>
                                    </div>
                                    <button onClick={() => handleAddCard(acc.id)} style={{border: 'none', background: 'var(--accent-blue)', color: 'white', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500}}>+ Карта</button>
                                </div>
                                <div className="grid-selector" style={{marginTop: '12px'}}>
                                    {cardDesigns.map(design => (
                                        <div key={design} className={`grid-item ${acc.cardDesignUrl === design ? 'selected' : ''}`} onClick={() => handleSetCardDesign(acc.id, design)}>
                                            <img src={design} alt="card design" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                         <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                             <button className="modal-button" onClick={() => handleAddNewAccount(true)}>+ Счет с картой</button>
                             <button className="modal-button" onClick={() => handleAddNewAccount(false)} style={{backgroundColor: 'var(--text-secondary)'}}>+ Счет без карты</button>
                         </div>
                    </div>

                     <div className="modal-section">
                        <h3 className="modal-title">Избранные контакты</h3>
                        {!isAddingContact ? (
                            <>
                                <div className="contact-list">
                                    {userData.favoriteContacts.map(contact => (
                                        <div key={contact.id} className="contact-item">
                                            <div className="contact-item-avatar">{contact.initials}</div>
                                            <div className="contact-item-info">
                                                <div className="contact-item-name">{contact.name}</div>
                                                <div className="contact-item-banks">
                                                    {contact.banks.map(bank => <img key={bank.id} src={bank.logoUrl} alt={bank.name}/>)}
                                                </div>
                                            </div>
                                            <button className="delete-contact-btn" onClick={() => handleDeleteContact(contact.id)}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="modal-button" onClick={() => setIsAddingContact(true)} style={{backgroundColor: '#34c759'}}>Добавить контакт</button>
                            </>
                        ) : (
                            <AddContactForm onSave={handleSaveContact} onCancel={() => setIsAddingContact(false)} />
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export const TransactionHistoryModal: React.FC<{ isOpen: boolean, onClose: () => void, transactions: Transaction[] }> = ({ isOpen, onClose, transactions }) => {
    const formatDateGroup = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) return 'Сегодня';
        if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
        
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    };

    const groupedTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .reduce((acc, transaction) => {
            const date = new Date(transaction.date).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(transaction);
            return acc;
        }, {} as Record<string, Transaction[]>);

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`modal-container ${isOpen ? 'open' : ''}`}>
                <div className="modal-handle"></div>
                <h2 className="modal-header">История операций</h2>
                <div className="modal-content">
                    {Object.entries(groupedTransactions).map(([dateStr, transactionsOnDate]) => (
                        <div key={dateStr} className="transaction-group">
                            <h3 className="transaction-date-header">{formatDateGroup(new Date(dateStr))}</h3>
                            <div className="transaction-list">
                                {transactionsOnDate.map(tx => (
                                    <div key={tx.id} className="transaction-item">
                                        <div className="transaction-icon" style={{ backgroundColor: tx.iconBg }}>
                                            <TransactionIcon category={tx.category} />
                                        </div>
                                        <div className="transaction-details">
                                            <div className="transaction-name">{tx.name}</div>
                                            <div className="transaction-category">{tx.description}</div>
                                        </div>
                                        <div className={`transaction-amount ${tx.amount < 0 ? 'expense' : 'income'}`}>
                                            {tx.amount < 0 ? '- ' : '+ '}
                                            {Math.abs(tx.amount).toLocaleString('ru-RU')} ₽
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export const CardDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; cardData: { account: Account; card: Card } | null; onAction: (action: string) => void; }> = ({ isOpen, onClose, cardData, onAction }) => {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (!isOpen) setShowDetails(false);
    }, [isOpen]);
    
    if (!isOpen || !cardData) return null;
    const { account, card } = cardData;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`modal-container full-screen ${isOpen ? 'open' : ''}`}>
                <div className="modal-header">
                    <button className="modal-back-btn" onClick={onClose}><BackIcon /></button>
                </div>
                <div className="modal-content">
                    <div className="card-details-view">
                        <div className="card-carousel-item">
                            <img src={account.cardDesignUrl} alt="Bank Card" />
                        </div>
                        <h3>{account.balance.toLocaleString('ru-RU')} ₽</h3>
                        <p>Дебетовая карта · {card.number.slice(-4)}</p>
                    </div>

                    <div className="card-details-actions">
                        <div className="card-action-btn" onClick={() => onAction('Блокировать карту')}>
                            <div><BlockIcon /></div>
                            <span>Блокировать</span>
                        </div>
                         <div className="card-action-btn" onClick={() => onAction('Перевыпустить карту')}>
                            <div><ReissueIcon /></div>
                            <span>Перевыпустить</span>
                        </div>
                         <div className="card-action-btn" onClick={() => onAction('Заморозить карту')}>
                            <div><FreezeIcon /></div>
                            <span>Заморозить</span>
                        </div>
                    </div>
                    
                    <div className="requisites-section">
                        <div className="requisites-header">
                            <h4>Реквизиты</h4>
                            <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Скрыть' : 'Показать'}</button>
                        </div>
                        <div className={`requisites-grid ${showDetails ? 'row-view' : ''}`}>
                            <div className="requisites-item">{showDetails ? card.number : `•••• ${card.number.slice(-4)}`}</div>
                            <div className="requisites-item">{showDetails ? card.expiry : '••/••'}</div>
                            <div className="requisites-item">{showDetails ? card.cvc : '•••'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const TransferModal: React.FC<{ isOpen: boolean; onClose: () => void; accounts: Account[]; setUserData: React.Dispatch<React.SetStateAction<UserData>>; }> = ({ isOpen, onClose, accounts, setUserData }) => {
    const [fromIndex, setFromIndex] = useState(0);
    const [toIndex, setToIndex] = useState(accounts.length > 1 ? 1 : 0);
    const [amount, setAmount] = useState('');
    const addToast = useToast();
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    const fromAccount = accounts[fromIndex];
    const toAccount = accounts[toIndex];

    useEffect(() => {
        if (isOpen) {
            setFromIndex(0);
            setToIndex(accounts.length > 1 ? 1 : 0);
            setAmount('');
            if(fromRef.current) fromRef.current.scrollLeft = 0;
            if(toRef.current) toRef.current.scrollLeft = toRef.current.clientWidth * 0.8 * (accounts.length > 1 ? 1 : 0);
        }
    }, [isOpen, accounts]);

    const handleScroll = (ref: React.RefObject<HTMLDivElement>, setIndex: (index: number) => void) => {
        if (!ref.current) return;
        const scrollLeft = ref.current.scrollLeft;
        const cardWidth = ref.current.clientWidth * 0.8; // 80% width
        const newIndex = Math.round(scrollLeft / cardWidth);
        setIndex(newIndex);
    };

    const handleTransfer = () => {
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            addToast("Введите корректную сумму");
            return;
        }
        if (fromAccount.id === toAccount.id) {
            addToast("Выберите разные счета");
            return;
        }
        if (fromAccount.balance < transferAmount) {
            addToast("Недостаточно средств на счете списания");
            return;
        }

        setUserData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc => {
                if (acc.id === fromAccount.id) return { ...acc, balance: acc.balance - transferAmount };
                if (acc.id === toAccount.id) return { ...acc, balance: acc.balance + transferAmount };
                return acc;
            })
        }));
        addToast(`Переведено ${transferAmount.toLocaleString('ru-RU')} ₽`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`modal-container full-screen ${isOpen ? 'open' : ''}`}>
                <div className="modal-header">
                    <button className="modal-back-btn" onClick={onClose}><BackIcon /></button>
                    Между счетами
                </div>
                <div className="modal-content" style={{padding: 0}}>
                    <div>
                        <p style={{padding: '0 16px 8px 16px', color: 'var(--text-secondary)'}}>Со счёта</p>
                        <div ref={fromRef} className="transfer-carousel" onScroll={() => handleScroll(fromRef, setFromIndex)}>
                            {accounts.map(acc => (
                                <div key={acc.id} className="transfer-account-card" style={{backgroundColor: '#E65540'}}>
                                    <p>{acc.name}</p>
                                    <h3>{acc.balance.toLocaleString('ru-RU')} ₽</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div style={{marginTop: '24px'}}>
                        <p style={{padding: '0 16px 8px 16px', color: 'var(--text-secondary)'}}>На счёт</p>
                        <div ref={toRef} className="transfer-carousel" onScroll={() => handleScroll(toRef, setToIndex)}>
                            {accounts.map(acc => (
                                <div key={acc.id} className="transfer-account-card" style={{backgroundColor: '#4986CC'}}>
                                    <p>{acc.name}</p>
                                    <h3>{acc.balance.toLocaleString('ru-RU')} ₽</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="amount-input-container">
                        <input 
                          type="number" 
                          className="modal-input" 
                          placeholder="0 ₽"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          style={{textAlign: 'center', fontSize: '32px', border: 'none', background: 'none'}}
                        />
                    </div>
                </div>
                 <div className="modal-footer">
                    <button className="modal-button" onClick={handleTransfer} disabled={!amount}>Перевести</button>
                </div>
            </div>
        </>
    );
};

export const TransferByPhoneModal: React.FC<{ isOpen: boolean; onClose: () => void; userData: UserData; setUserData: React.Dispatch<React.SetStateAction<UserData>>; }> = ({ isOpen, onClose, userData, setUserData }) => {
    const [fromIndex, setFromIndex] = useState(0);
    const [phone, setPhone] = useState('+7 989 612-01-79');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const addToast = useToast();
    const fromRef = useRef<HTMLDivElement>(null);

    const suggestedContacts = userData.favoriteContacts.filter(c => phone && c.phone.replace(/\D/g, '').includes(phone.replace(/\D/g, '')));
    const suggestedBanks = suggestedContacts.flatMap(c => c.banks.map(b => ({...b, contactName: formatContactName(c.name)})));

    useEffect(() => {
        if (isOpen) {
            setFromIndex(0);
            setPhone('');
            setAmount('');
            setMessage('');
            setSelectedBank(null);
            if(fromRef.current) fromRef.current.scrollLeft = 0;
        }
    }, [isOpen, userData.accounts]);

     const handleScroll = (ref: React.RefObject<HTMLDivElement>, setIndex: (index: number) => void) => {
        if (!ref.current) return;
        const scrollLeft = ref.current.scrollLeft;
        const cardWidth = ref.current.clientWidth * 0.8; 
        const newIndex = Math.round(scrollLeft / cardWidth);
        setIndex(newIndex);
    };

    const handleTransfer = () => {
        addToast("Перевод по телефону в разработке");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`modal-container full-screen ${isOpen ? 'open' : ''}`}>
                <div className="modal-header">
                    <button className="modal-back-btn" onClick={onClose}><BackIcon /></button>
                    По номеру телефона
                </div>
                <div className="modal-content" style={{padding: 0}}>
                    <div>
                        <p style={{padding: '0 16px 8px 16px', color: 'var(--text-secondary)'}}>Со счёта</p>
                        <div ref={fromRef} className="transfer-carousel" onScroll={() => handleScroll(fromRef, setFromIndex)}>
                            {userData.accounts.map(acc => (
                                <div key={acc.id} className="transfer-account-card" style={{backgroundColor: '#E65540'}}>
                                    <p>{acc.name}</p>
                                    <h3>{acc.balance.toLocaleString('ru-RU')} ₽</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="phone-transfer-content">
                        <input type="tel" className="modal-input" placeholder="Номер телефона" value={phone} onChange={e => setPhone(e.target.value)} style={{marginBottom: '16px'}}/>

                        <div className="bank-suggestions">
                            {suggestedBanks.map(bank => (
                                <div 
                                  key={bank.id} 
                                  className={`bank-card ${selectedBank?.id === bank.id ? 'selected' : ''}`} 
                                  style={{ background: bank.gradient }}
                                  onClick={() => setSelectedBank(bank)}
                                >
                                    <div className="bank-card-logo"><img src={bank.logoUrl} alt={bank.name}/></div>
                                    <div className="bank-card-name">{bank.name}</div>
                                    <div className="bank-card-user">{bank.contactName}</div>
                                </div>
                            ))}
                             <div className="bank-card" style={{ background: allBanks.find(b=>b.id==='other')!.gradient }}>
                                <div className="bank-card-logo"><img src={allBanks.find(b=>b.id==='other')!.logoUrl} alt="Другой банк"/></div>
                                <div className="bank-card-name">Другой банк</div>
                            </div>
                        </div>
                         <input type="number" className="modal-input" placeholder="0 ₽" value={amount} onChange={e => setAmount(e.target.value)} style={{marginTop: '24px'}} />
                         <input type="text" className="modal-input" placeholder="Сообщение получателю" value={message} onChange={e => setMessage(e.target.value)} style={{marginTop: '12px'}} />
                    </div>
                </div>
                 <div className="modal-footer">
                    <button className="modal-button" onClick={handleTransfer} disabled={!amount || !selectedBank}>Перевести</button>
                </div>
            </div>
        </>
    );
};


export const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: '80px' }}>
        <h1 style={{textTransform: 'capitalize', color: '#858D97'}}>{title}</h1>
    </main>
);

export const BottomNav: React.FC<{ activeTab: TabName, setActiveTab: (tab: TabName) => void }> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'main', label: 'Главная', icon: <svg viewBox="0 0 24 24"><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"></path></svg> },
        { id: 'payments', label: 'Платежи', icon: <svg viewBox="0 0 24 24"><path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.3 1-1.02 1-1.72v-4c0-.7-.41-1.42-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z"></path></svg> },
        { id: 'city', label: 'Город', icon: <svg viewBox="0 0 24 24"><path d="M8.29 6.71L3.58 11.41l4.71 4.7c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L6.41 12l3.29-3.29c.39-.39.39-1.02 0-1.41a.996.996 0 00-1.41 0zm7.42 10.58l4.71-4.7-4.71-4.7a.996.996 0 00-1.41 0c-.39.39-.39 1.02 0 1.41L17.59 12l-3.29 3.29c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0z"></path></svg> },
        { id: 'chat', label: 'Чат', icon: <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg> },
        { id: 'more', label: 'Ещё', icon: <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg> },
    ];
    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                 <div key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id as TabName)}>
                    {item.id === 'chat' && <div className="nav-notification">3</div>}
                    <div className="icon-container">{item.icon}</div>
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
};