import React, { useState, useRef, useLayoutEffect } from 'react';
import { MainScreen, PaymentsScreen, ChatScreen } from './screens.tsx';
import { BottomNav, PlaceholderScreen, ProfileModal, TransactionHistoryModal, CardDetailsModal, TransferModal, TransferByPhoneModal, allBanks } from './components.tsx';
import type { TabName, UserData, Bank, Account, Card } from './types.ts';
import { useToast } from './components.tsx';

const tabOrder: TabName[] = ['main', 'payments', 'city', 'chat', 'more'];

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(now.getDate() - 2);

const initialUserData: UserData = {
    name: 'Артем',
    avatarUrl: 'https://i.pravatar.cc/80?u=artem',
    accounts: [],
    cashbackPartners: [
        {id: 'p1', logoUrl: 'https://i.imgur.com/uplZIqA.png'},
        {id: 'p2', logoUrl: 'https://i.imgur.com/EzmYEEI.png'},
        {id: 'p3', logoUrl: 'https://i.imgur.com/bGshFAV.png'},
    ],
    cashbackProgress: [
        { color: '#8E44AD', percentage: 40 },
        { color: '#3498DB', percentage: 30 },
        { color: '#F1C40F', percentage: 20 },
        { color: '#E74C3C', percentage: 10 },
    ],
    favoriteContacts: [
        { id: 1, name: 'Ксения Кравцова', initials: 'КК', phone: '+79261234567', banks: [allBanks[0]] },
        { id: 2, name: 'Марина Борисова', initials: 'МБ', phone: '+79809082239', banks: [allBanks[0], allBanks.find(b => b.id === 'youmoney')!] },
        { id: 3, name: 'Архипп Богданов', initials: 'АБ', phone: '+79896120179', banks: [allBanks.find(b => b.id === 'alfa')!, allBanks.find(b => b.id === 'sber')!, allBanks.find(b => b.id === 'yandex')!]},
    ],
    transactions: [
        { id: 't1', name: 'Перевод от Ксении К.', description: 'Пополнение', amount: 5000, category: 'income', iconBg: '#2ECC71', date: now.toISOString() },
        { id: 't2', name: 'Пятёрочка', description: 'Супермаркеты', amount: -1240.50, category: 'food', iconBg: '#F39C12', date: now.toISOString() },
        { id: 't3', name: 'Яндекс.Такси', description: 'Транспорт', amount: -450, category: 'transport', iconBg: '#3498DB', date: yesterday.toISOString() },
        { id: 't4', name: 'Ozon.ru', description: 'Покупки', amount: -5200, category: 'shopping', iconBg: '#9B59B6', date: yesterday.toISOString() },
        { id: 't5', name: 'Аптека', description: 'Здоровье', amount: -780, category: 'health', iconBg: '#E74C3C', date: twoDaysAgo.toISOString() },
        { id: 't6', name: 'Вкусно и Точка', description: 'Рестораны', amount: -560, category: 'food', iconBg: '#F39C12', date: twoDaysAgo.toISOString() },
    ]
}


export const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabName>('main');
    const [animationClass, setAnimationClass] = useState('');
    const prevTabRef = useRef<TabName>('main');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isPhoneTransferOpen, setIsPhoneTransferOpen] = useState(false);
    const [cardDetailsData, setCardDetailsData] = useState<{ account: Account, card: Card } | null>(null);
    const [userData, setUserData] = useState<UserData>(initialUserData);
    const addToast = useToast();

    const handleAction = (action: string) => {
        if (action.startsWith('Открыть карту')) {
            const [accountId, cardId] = action.split(' ')[2].split('/');
            const account = userData.accounts.find(a => a.id === parseInt(accountId));
            if (account) {
                const card = account.cards.find(c => c.id === cardId);
                if (card) {
                    setCardDetailsData({ account, card });
                }
            }
        } else if (action === 'Между счетами') {
            setIsTransferOpen(true);
        } else if (action === 'Перевести по телефону') {
            setIsPhoneTransferOpen(true);
        } else if (action === 'Блокировать карту') {
            addToast('Карта заблокирована');
        } else if (action === 'Перевыпустить карту') {
            addToast('Заявка на перевыпуск принята');
        } else if (action === 'Заморозить карту') {
            addToast('Операции по карте заморожены');
        } else {
           addToast(`'${action}' в разработке`);
        }
    };

    useLayoutEffect(() => {
        const prevIndex = tabOrder.indexOf(prevTabRef.current);
        const nextIndex = tabOrder.indexOf(activeTab);
        if (prevIndex !== nextIndex) {
            setAnimationClass(nextIndex > prevIndex ? 'slide-in-right' : 'slide-in-left');
        }
        prevTabRef.current = activeTab;
    }, [activeTab]);

    const renderContent = () => {
        const mainScreenProps = {
            userData,
            setUserData,
            onProfileClick: () => setIsProfileOpen(true),
            isProfileOpen,
            onHistoryClick: () => setIsHistoryOpen(true),
            onAction: handleAction
        };

        switch (activeTab) {
            case 'main': return <MainScreen {...mainScreenProps} />;
            case 'payments': return <PaymentsScreen />;
            case 'city': return <PlaceholderScreen title="Город" />;
            case 'chat': return <ChatScreen />;
            case 'more': return <PlaceholderScreen title="Ещё" />;
            default: return <MainScreen {...mainScreenProps} />;
        }
    };
    
    return (
        <>
            <div className={`page-container ${animationClass}`} key={activeTab}>
                {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userData={userData} setUserData={setUserData}/>
            <TransactionHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} transactions={userData.transactions} />
            <CardDetailsModal isOpen={!!cardDetailsData} onClose={() => setCardDetailsData(null)} cardData={cardDetailsData} onAction={handleAction} />
            <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} accounts={userData.accounts} setUserData={setUserData} />
            <TransferByPhoneModal isOpen={isPhoneTransferOpen} onClose={() => setIsPhoneTransferOpen(false)} userData={userData} setUserData={setUserData} />
        </>
    );
};