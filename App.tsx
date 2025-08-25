import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { MainScreen, PaymentsScreen, ChatScreen, AdminScreen, LoginScreen } from './screens.tsx';
import { BottomNav, PlaceholderScreen, ProfileModal, TransactionHistoryModal, CardDetailsModal, TransferModal, TransferByPhoneModal, AccountDetailsModal, allBanks, CardTransferModal, TransferSuccessModal } from './components.tsx';
import type { TabName, UserData, Bank, Account, Card, Transaction, TransferSuccessDetails } from './types.ts';
import { useToast } from './components.tsx';
import type { Auth } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';


// --- SIMULATED DATABASE ---
const createInitialUsers = (): Record<string, UserData> => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const userAccount: Account = {
        id: 1, name: 'Зарплатная', balance: 10000, color: '#E65540', 
        iconName: 'https://i.imgur.com/Ov4ZuWS.png', iconBg: '#4986CC',
        badge: { text: '129', color: '#FF3B30' },
        cards: [{id: 'c1', number: '2200 1234 5678 9101', expiry: '12/28', cvc: '123'}],
        cardDesignUrl: 'https://i.imgur.com/QWaK5r7.jpeg'
    };
    
    return {
        'user@tbank.ru': {
            email: 'user@tbank.ru', frozen: false, name: 'Артем', avatarUrl: 'https://i.pravatar.cc/80?u=artem',
            isPremium: false, isAdmin: false, donationBalance: 0,
            accounts: [userAccount],
            monthlySpending: { month: 'августе', amount: 339708 },
            cashbackPartners: [{id: 'p1', logoUrl: 'https://i.imgur.com/uplZIqA.png'}, {id: 'p2', logoUrl: 'https://i.imgur.com/EzmYEEI.png'}, {id: 'p3', logoUrl: 'https://i.imgur.com/bGshFAV.png'}],
            cashbackProgress: [{ color: '#8E44AD', percentage: 40 }, { color: '#3498DB', percentage: 30 }, { color: '#F1C40F', percentage: 20 }, { color: '#E74C3C', percentage: 10 }],
            favoriteContacts: [{ id: 1, name: 'Ксения Кравцова', initials: 'КК', phone: '+79261234567', banks: [allBanks[0]] }, { id: 2, name: 'Марина Борисова', initials: 'МБ', phone: '+79809082239', banks: [allBanks[0]] }, { id: 3, name: 'Архипп Богданов', initials: 'АБ', phone: '+79896120179', banks: [allBanks.find(b => b.id === 'alfa')!, allBanks.find(b => b.id === 'sber')!, allBanks.find(b => b.id === 'yandex')!]}],
            transactions: [{ id: 't1', name: 'Перевод от Ксении К.', description: 'Пополнение', amount: 5000, category: 'income', iconBg: '#2ECC71', date: now.toISOString() }, { id: 't2', name: 'Пятёрочка', description: 'Супермаркеты', amount: -1240.50, category: 'food', iconBg: '#F39C12', date: yesterday.toISOString() }],
            customBanks: []
        },
        'admin@tbank.ru': {
            email: 'admin@tbank.ru', frozen: false, name: 'Admin', avatarUrl: 'https://i.pravatar.cc/80?u=admin',
            isPremium: true, isAdmin: true, donationBalance: 10,
            accounts: [], monthlySpending: { month: 'августе', amount: 0 },
            cashbackPartners: [], cashbackProgress: [], favoriteContacts: [], transactions: [], customBanks: []
        },
    };
};


export const App: React.FC<{ auth: Auth }> = ({ auth }) => {
    const [usersDB, setUsersDB] = useState<Record<string, UserData>>(createInitialUsers());
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [authError, setAuthError] = useState('');
    
    const [activeTab, setActiveTab] = useState<TabName>('main');
    const [animationClass, setAnimationClass] = useState('');
    const prevTabRef = useRef<TabName>('main');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isPhoneTransferOpen, setIsPhoneTransferOpen] = useState(false);
    const [isCardTransferOpen, setIsCardTransferOpen] = useState(false);
    const [cardDetailsData, setCardDetailsData] = useState<{ account: Account, card: Card } | null>(null);
    const [accountDetailsData, setAccountDetailsData] = useState<Account | null>(null);
    const [transferSuccessDetails, setTransferSuccessDetails] = useState<TransferSuccessDetails | null>(null);
    const addToast = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUserEmail(user ? user.email : null);
        });
        return () => unsubscribe();
    }, [auth]);
    
    const currentUserData = currentUserEmail ? usersDB[currentUserEmail] : null;
    const setCurrentUserData = (updater: React.SetStateAction<UserData>) => {
        if (!currentUserEmail) return;
        setUsersDB(prevDB => ({
            ...prevDB,
            [currentUserEmail]: typeof updater === 'function' ? updater(prevDB[currentUserEmail]) : updater
        }));
    };

    const handleLogin = (email: string, pass: string) => {
        setAuthError('');
        signInWithEmailAndPassword(auth, email, pass).catch(err => {
            setAuthError('Неверный email или пароль.');
        });
    };
    
    const handleLogout = () => {
        signOut(auth);
    };
    
    const handleUserUpdateByAdmin = (updatedUser: UserData) => {
         setUsersDB(prevDB => ({ ...prevDB, [updatedUser.email]: updatedUser }));
         addToast(`Данные ${updatedUser.email} обновлены`);
    };

    const handleSuccessfulTransfer = (details: TransferSuccessDetails) => {
        const fromAccount = currentUserData?.accounts.find(a => a.name === details.fromAccountName);
        if (!fromAccount) return;

        // Create transactions
        const debitTx: Transaction = { id: `tx-${Date.now()}`, date: new Date().toISOString(), amount: -details.amount, name: `Перевод ${details.recipientName}`, description: `На карту ${details.recipientBank.name}`, category: 'transfer', iconBg: '#E74C3C' };
        
        // Update state
        setCurrentUserData(prev => {
            const newAccounts = prev.accounts.map(acc => 
                acc.id === fromAccount.id ? { ...acc, balance: details.balanceAfter } : acc
            );
            return {
                ...prev,
                accounts: newAccounts,
                transactions: [debitTx, ...prev.transactions]
            }
        });

        // Show success screen
        setTransferSuccessDetails(details);
    };

    const handleAction = (action: string) => {
        if (action.startsWith('Открыть карту')) {
            const [accountId, cardId] = action.split(' ')[2].split('/');
            const account = currentUserData?.accounts.find(a => a.id === parseInt(accountId));
            if (account) {
                const card = account.cards.find(c => c.id === cardId);
                if (card) {
                    setCardDetailsData({ account, card });
                }
            }
        } else if (action.startsWith('Открыть счет')) {
            const accountId = parseInt(action.split(' ')[2]);
            const account = currentUserData?.accounts.find(a => a.id === accountId);
            if (account) {
                setAccountDetailsData(account);
            }
        } else if (action === 'Между счетами') {
            setIsTransferOpen(true);
        } else if (action === 'Перевести по телефону') {
            setIsPhoneTransferOpen(true);
        } else if (action === 'По номеру карты') {
            setIsCardTransferOpen(true);
        } else if (['Блокировать карту', 'Перевыпустить карту', 'Заморозить карту'].includes(action)) {
            addToast(`Действие "${action}" выполнено`);
        } else {
           addToast(`'${action}' в разработке`);
        }
    };
    
    const handleExchangeDonations = (amount: number) => {
        if (!currentUserData) return;
        if (amount > currentUserData.donationBalance) {
            addToast('Недостаточно донатов для обмена');
            return;
        }
        
        const firstAccount = currentUserData.accounts[0];
        if (!firstAccount) {
            addToast('Не найден счет для зачисления');
            return;
        }
        
        const rublesToAdd = amount * 500;
        
        setCurrentUserData(prev => {
            const newAccounts = prev.accounts.map(acc => 
                acc.id === firstAccount.id ? { ...acc, balance: acc.balance + rublesToAdd } : acc
            );
            return { ...prev, donationBalance: prev.donationBalance - amount, accounts: newAccounts };
        });
        addToast(`Обмен произведен! ${rublesToAdd.toLocaleString('ru-RU')} ₽ зачислено.`);
    };

    useLayoutEffect(() => {
        const tabOrder: TabName[] = ['main', 'payments', 'city', 'chat', 'more', 'admin'];
        const prevIndex = tabOrder.indexOf(prevTabRef.current);
        const nextIndex = tabOrder.indexOf(activeTab);
        if (prevIndex !== nextIndex) {
            setAnimationClass(nextIndex > prevIndex ? 'slide-in-right' : 'slide-in-left');
        }
        prevTabRef.current = activeTab;
    }, [activeTab]);
    
    if (!currentUserData) {
        return <LoginScreen onLogin={handleLogin} error={authError} />;
    }
    
    if (currentUserData.frozen) {
        return <div className="frozen-overlay"><h2>Аккаунт заморожен</h2><p>Обратитесь в поддержку</p></div>;
    }

    const renderContent = () => {
        const mainScreenProps = {
            userData: currentUserData,
            setUserData: setCurrentUserData,
            onProfileClick: () => setIsProfileOpen(true),
            isProfileOpen,
            onHistoryClick: () => setIsHistoryOpen(true),
            onAction: handleAction
        };

        switch (activeTab) {
            case 'main': return <MainScreen {...mainScreenProps} />;
            case 'payments': return <PaymentsScreen onAction={handleAction} />;
            case 'city': return <PlaceholderScreen title="Город" />;
            case 'chat': return <ChatScreen />;
            case 'more': return <PlaceholderScreen title="Ещё" />;
            case 'admin': return currentUserData.isAdmin ? <AdminScreen users={Object.values(usersDB)} onUserUpdate={handleUserUpdateByAdmin} /> : <MainScreen {...mainScreenProps} />;
            default: return <MainScreen {...mainScreenProps} />;
        }
    };
    
    return (
        <>
            <div className={`page-container ${animationClass}`} key={activeTab}>
                {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={currentUserData.isAdmin}/>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userData={currentUserData} setUserData={setCurrentUserData} exchangeDonations={handleExchangeDonations} onLogout={handleLogout} />
            <TransactionHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} transactions={currentUserData.transactions} />
            <AccountDetailsModal isOpen={!!accountDetailsData} onClose={() => setAccountDetailsData(null)} account={accountDetailsData} onAction={handleAction} />
            <CardDetailsModal isOpen={!!cardDetailsData} onClose={() => setCardDetailsData(null)} cardData={cardDetailsData} onAction={handleAction} />
            <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} accounts={currentUserData.accounts} onSuccessfulTransfer={handleSuccessfulTransfer} />
            <TransferByPhoneModal isOpen={isPhoneTransferOpen} onClose={() => setIsPhoneTransferOpen(false)} userData={currentUserData} onSuccessfulTransfer={handleSuccessfulTransfer} />
            <CardTransferModal isOpen={isCardTransferOpen} onClose={() => setIsCardTransferOpen(false)} userData={currentUserData} onSuccessfulTransfer={handleSuccessfulTransfer} />
            <TransferSuccessModal isOpen={!!transferSuccessDetails} onClose={() => setTransferSuccessDetails(null)} details={transferSuccessDetails} onAction={handleAction} />
        </>
    );
};