import React, { useEffect, useContext, createContext, useState, useRef } from 'react';
import type { Toast, ToastContextType, TabName, UserData, Card, Account, CashbackPartner, FavoriteContact, Bank, Transaction, TransactionCategory } from './types.ts';

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
const allBanks: Bank[] = [
    { id: 't-bank', name: 'Т-Банк', logoUrl: 'https://336118.selcdn.ru/Gutsy-Culebra/products/T-Bank-Seller-Logo.png' },
    { id: 'sber', name: 'Сбер', logoUrl: 'https://i.imgur.com/ZXP1II7.jpeg' },
    { id: 'vtb', name: 'ВТБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/VTB_Logo_2018.svg/1200px-VTB_Logo_2018.png' },
    { id: 'psb', name: 'ПСБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/ru/2/21/%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF_%D0%9F%D0%A1%D0%91.png' },
    { id: 'alfa', name: 'Альфа-Банк', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_alfa-bank.svg/2422px-Logo_alfa-bank.png' },
    { id: 'raif', name: 'Райффайзен', logoUrl: 'https://cdn.worldvectorlogo.com/logos/raiffeisen-1.svg' },
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
export const BetweenAccountsIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14.6,8.8L12,6.2L9.4,8.8l-1.4-1.4l4-4l4,4L14.6,8.8z M9.4,15.2L12,17.8l2.6-2.6l1.4,1.4l-4,4l-4-4L9.4,15.2z"/></svg>;
export const QRIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,13.5h-4v-4h4V13.5z M8,11.5h-1v1h1V11.5z M13.5,9.5h-4v-4h4V9.5z M12,7.5h-1v1h1V7.5z M18.5,9.5h-4v-4h4V9.5z M17,7.5h-1v1h1V7.5z M18.5,18.5h-4v-4h4V18.5z M17,16.5h-1v1h1V16.5z M4,4v7h7V4H4z M9,9H6V6h3V9z M4,13v7h7v-7H4z M9,18H6v-3h3V18z M13,4v7h7V4H13z M18,9h-3V6h3V9z M13,13v7h7v-7H13z M18,18h-3v-3h3V18z"/></svg>;
export const RubleIcon = () => <svg viewBox="0 0 24 24"><path fill="white" d="M11.5 5h-2v6H8v2h1.5v2H8v2h1.5v3h2v-3H14v-2h-2.5v-2H14a3 3 0 0 0 0-6h-2.5zm0 2h2.5a1 1 0 0 1 0 2H11.5z"/></svg>;
export const ThreeDotsIcon = () => <svg viewBox="0 0 24 24" fill="white"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>;
export const TransfersIcon = () => <svg viewBox="0 0 24 24"><path fill="white" d="M20 18v-2h-8v2h8zm-8-3.5h8v-2h-8v2zM4 14.5v-11h14v11h-2V7H6v5.5H4z"/></svg>;
export const TinkoffIcon = () => <svg viewBox="0 0 24 24" fill="#FDD900"><path d="M20.9 6.95v-.17c0-1.1-.9-2-2-2h-1.45l-3.37 4.1-.73-4.1h-1.45v10.4h1.94v-6.23l4.13 6.23h1.94V6.95zM4.14 15.18V4.78h7.94v1.44H6.08v3.08h5.2v1.44h-5.2v4.44h-1.94z"/></svg>;
export const MobileIcon = () => <svg viewBox="0 0 24 24" fill="#4991F8"><path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/></svg>;
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
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;
// Transaction Icons
const FoodIcon = () => <svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>;
const ShoppingIcon = () => <svg viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h12v12z"/></svg>;
const TransportIcon = () => <svg viewBox="0 0 24 24"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.02-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.2 6.45 8 5.25 8 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>;
const HealthIcon = () => <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6v-3h12v3zm0-5H6V8h12v6z"/></svg>;
const IncomeIcon = () => <svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>;

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
export const Header: React.FC<{ name: string; onProfileClick: () => void; isProfileOpen: boolean; onAction: (action: string) => void }> = ({ name, onProfileClick, isProfileOpen, onAction }) => (
    <header className="app-header">
      <div className="user-profile" onClick={onProfileClick}>
        <div className="avatar"></div>
        <div className={`user-name ${isProfileOpen ? 'open' : ''}`}>{name} <ChevronDownIcon /></div>
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
        { label: 'Пополнить Зарплатная', icon: <PlusIcon /> },
        { label: 'Между счетами', icon: <BetweenAccountsIcon /> },
        { label: 'Сканировать QR-код', icon: <QRIcon /> },
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

export const CardCarousel: React.FC<{ cards: Card[], designUrl: string, onAction: (action: string) => void }> = ({ cards, designUrl, onAction }) => (
    <div className="card-carousel">
        {cards.map(card => (
            <div key={card.id} className="card-carousel-item" onClick={() => onAction(`Открыть карту ${card.id}`)}>
                <img src={designUrl} alt="Bank Card" />
            </div>
        ))}
    </div>
);

const AccountIconRenderer: React.FC<{ iconName: string }> = ({ iconName }) => {
    switch(iconName) {
        case 'ruble': return <RubleIcon />;
        case 'transfers': return <TransfersIcon />;
        case 'three-dots': return <ThreeDotsIcon />;
        default: return null;
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
                    <CardCarousel cards={account.cards} designUrl={account.cardDesignUrl} onAction={onAction} />
                }
            </div>
             <div className="account-info-right">
                <span className="account-balance">{account.balance}</span>
                {account.badge && <span className="notification-badge">{account.badge}</span>}
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
    const addToast = useToast();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isAddingContact, setIsAddingContact] = useState(false);

    useEffect(() => {
        setTempName(userData.name);
        if (!isOpen) {
            setIsAddingContact(false); // Reset form state on close
        }
    }, [userData.name, isOpen]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempName(e.target.value);
    };

    const saveName = () => {
        if (tempName.trim() !== userData.name) {
            setUserData(prev => ({ ...prev, name: tempName.trim() }));
            addToast('Имя обновлено!');
        }
    };

    const handleSetCardDesign = (accountId: number, designUrl: string) => {
        setUserData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc => acc.id === accountId ? { ...acc, cardDesignUrl: designUrl } : acc)
        }));
    };

    const handleAddCard = (accountId: number) => {
        setUserData(prev => {
            const newAccounts = prev.accounts.map(acc => {
                if (acc.id === accountId) {
                    if (!acc.cardDesignUrl) {
                        addToast('Сначала выберите дизайн для счета');
                        return acc;
                    }
                    if (acc.cards.length >= 5) {
                        addToast('Достигнут лимит карт для этого счета');
                        return acc;
                    }
                    addToast('Карта добавлена');
                    return { ...acc, cards: [...acc.cards, { id: `card-${Date.now()}` }] };
                }
                return acc;
            });
            return { ...prev, accounts: newAccounts };
        });
    };
    
    const handleAddNewAccount = (withCard: boolean) => {
        setUserData(prev => {
            const newAccount: Account = {
                id: Date.now(),
                main: false,
                name: "Новый счет",
                balance: "0 ₽",
                iconName: 'ruble',
                iconBg: '#4A90E2',
                cards: withCard ? [{ id: `card-${Date.now()}` }] : [],
                cardDesignUrl: withCard ? cardDesigns[0] : undefined
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

    const changeCashbackIcons = () => {
        const shuffledIcons = [...cashbackIcons].sort(() => 0.5 - Math.random());
        setUserData(prev => ({
            ...prev,
            cashbackPartners: prev.cashbackPartners.map((p, i) => ({
                ...p,
                logoUrl: shuffledIcons[i % shuffledIcons.length]
            }))
        }));
        addToast('Иконки кэшбэка изменены!');
    };

    const changeCashbackColors = () => {
        const colors = ["#8E44AD", "#3498DB", "#F1C40F", "#E74C3C", "#2ECC71", "#E67E22"];
        const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
        setUserData(prev => ({
             ...prev, 
             cashbackProgress: prev.cashbackProgress.map((p, i) => ({
                ...p,
                color: shuffledColors[i % shuffledColors.length]
             }))
        }));
        addToast('Цвета бонусов изменены!');
    }

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div ref={modalRef} className={`modal-container ${isOpen ? 'open' : ''}`}>
                <div className="modal-handle"></div>
                <div className="modal-content">
                    <div className="modal-section">
                        <h3 className="modal-title">Профиль</h3>
                        <div className="input-group">
                            <label htmlFor="userName">Ваше имя</label>
                            <input id="userName" type="text" value={tempName} onChange={handleNameChange} onBlur={saveName} />
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3 className="modal-title">Счета и карты</h3>
                        {userData.accounts.map(acc => (
                            <div key={acc.id} className="section" style={{padding: '12px', marginBottom: '12px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <p style={{fontWeight: 600}}>{acc.name} ({acc.cards.length}/5 карт)</p>
                                    <button onClick={() => handleAddCard(acc.id)} style={{border: 'none', background: 'var(--background-input)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer'}}>+ Карта</button>
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
                        <h3 className="modal-title">Настройка бонусов</h3>
                         <button className="modal-button" onClick={changeCashbackIcons} style={{marginBottom: '8px', backgroundColor: '#5856d6'}}>Сменить иконки кэшбэка</button>
                        <button className="modal-button" onClick={changeCashbackColors} style={{backgroundColor: '#5ac8fa'}}>Сменить цвета бонусов</button>
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
    const modalRef = useRef<HTMLDivElement>(null);

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
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
        }, {} as Record<string, Transaction[]>);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div ref={modalRef} className={`modal-container ${isOpen ? 'open' : ''}`}>
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
                    {item.id === 'chat' && <div className="nav-notification">2</div>}
                    <div className="icon-container">{item.icon}</div>
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
};