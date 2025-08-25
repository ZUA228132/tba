import React, { useEffect, useContext, createContext, useState, useRef } from 'react';
import type { Toast, ToastContextType, TabName, UserData, Card, Account, CashbackPartner, FavoriteContact, Bank } from './types.ts';

// --- DATA ---
const cardDesigns = [
    'https://i.imgur.com/QrZADtb.png',
    'https://i.imgur.com/3MNT66B.png',
    'https://i.imgur.com/fmnHpJs.png',
    'https://i.imgur.com/kt7QVs5.png'
];
const cashbackIcons = [
    'https://i.imgur.com/uplZIqA.png',
    'https://i.imgur.com/EzmYEEI.png',
    'https://i.imgur.com/bGshFAV.png'
];
const allBanks: Bank[] = [
    { id: 't-bank', name: 'Т-Банк', logoUrl: 'https://336118.selcdn.ru/Gutsy-Culebra/products/T-Bank-Seller-Logo.png' },
    { id: 'sber', name: 'Сбер', logoUrl: 'https://i.pinimg.com/1200x/92/ae/48/92/ae481096cfc19a71486694b627e11b.jpg' },
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
export const TransferIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.7,13.3l-1.4,1.4l4.6,4.6l4.6-4.6l-1.4-1.4L12,16.2L8.7,13.3z M15.3,10.7l1.4-1.4l-4.6-4.6l-4.6,4.6l1.4,1.4L12,7.8L15.3,10.7z"/></svg>;
export const TopUpIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,5.8L15.2,9l-1.4,1.4L12,8.6L10.2,10.4L8.8,9L12,5.8z M12,18.2l-3.2-3.2l1.4-1.4l1.8,1.8l1.8-1.8l1.4,1.4L12,18.2z"/></svg>;
export const BetweenAccountsIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14.6,8.8L12,6.2L9.4,8.8l-1.4-1.4l4-4l4,4L14.6,8.8z M9.4,15.2L12,17.8l2.6-2.6l1.4,1.4l-4,4l-4-4L9.4,15.2z"/></svg>;
export const QRIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,13.5h-4v-4h4V13.5z M8,11.5h-1v1h1V11.5z M13.5,9.5h-4v-4h4V9.5z M12,7.5h-1v1h1V7.5z M18.5,9.5h-4v-4h4V9.5z M17,7.5h-1v1h1V7.5z M18.5,18.5h-4v-4h4V18.5z M17,16.5h-1v1h1V16.5z M4,4v7h7V4H4z M9,9H6V6h3V9z M4,13v7h7v-7H4z M9,18H6v-3h3V18z M13,4v7h7V4H13z M18,9h-3V6h3V9z M13,13v7h7v-7H13z M18,18h-3v-3h3V18z"/></svg>;
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

export const InfoCards: React.FC<{ partners: CashbackPartner[], progress: { color: string, percentage: number }[], onAction: (action: string) => void }> = ({ partners, progress, onAction }) => (
    <section className="info-cards-section">
        <div className="info-card" onClick={() => onAction('Перейти к операциям')}>
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
        { label: 'Перевести по телефону', icon: <TransferIcon />, color: 'rgba(52, 199, 89, 0.15)' },
        { label: 'Пополнить', icon: <TopUpIcon />, color: 'rgba(88, 86, 214, 0.15)' },
        { label: 'Между счетами', icon: <BetweenAccountsIcon />, color: 'rgba(0, 122, 255, 0.15)' },
        { label: 'Сканировать QR-код', icon: <QRIcon />, color: 'rgba(255, 149, 0, 0.15)' },
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

export const CardCarousel: React.FC<{ cards: Card[], designUrl: string, onAction: (action: string) => void }> = ({ cards, designUrl, onAction }) => (
    <div className="card-carousel">
        {cards.map(card => (
            <div key={card.id} className="card-carousel-item" onClick={() => onAction(`Открыть карту ${card.id}`)}>
                <img src={designUrl} alt="Bank Card" />
            </div>
        ))}
    </div>
);

export const AccountCard: React.FC<{ account: Account, isAnimated: boolean, animationIndex: number, onAction: (action: string) => void }> = ({ account, isAnimated, animationIndex, onAction }) => (
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
                icon: <RubleIcon />,
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

    const changeCashbackIcons = () => {
        setUserData(prev => ({
            ...prev,
            cashbackPartners: [
                {id: '1', logoUrl: cashbackIcons[Math.floor(Math.random()*3)]},
                {id: '2', logoUrl: cashbackIcons[Math.floor(Math.random()*3)]},
                {id: '3', logoUrl: cashbackIcons[Math.floor(Math.random()*3)]},
            ]
        }));
        addToast('Иконки кэшбэка изменены!');
    };

    const changeCashbackColors = () => {
        const colors = ["#8E44AD", "#3498DB", "#F1C40F", "#E74C3C", "#2ECC71", "#E67E22"];
        const newProgress = Array.from({length: 4}, () => ({
            color: colors[Math.floor(Math.random() * colors.length)],
            percentage: 25
        }));
        setUserData(prev => ({ ...prev, cashbackProgress: newProgress}));
        addToast('Цвета бонусов изменены!');
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen && !document.querySelector('.modal-overlay.open')) return null;

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