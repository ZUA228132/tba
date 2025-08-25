import React, { useState, useRef, useLayoutEffect } from 'react';
import { MainScreen, PaymentsScreen } from './screens.tsx';
import { BottomNav, PlaceholderScreen, ProfileModal, TransactionHistoryModal } from './components.tsx';
import type { TabName, UserData, Bank, Account } from './types.ts';

const tabOrder: TabName[] = ['main', 'payments', 'city', 'chat', 'more'];

const allBanks: Bank[] = [
    { id: 't-bank', name: 'Т-Банк', logoUrl: 'https://336118.selcdn.ru/Gutsy-Culebra/products/T-Bank-Seller-Logo.png' },
    { id: 'sber', name: 'Сбер', logoUrl: 'https://i.imgur.com/ZXP1II7.jpeg' },
    { id: 'vtb', name: 'ВТБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/VTB_Logo_2018.svg/1200px-VTB_Logo_2018.png' },
];

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(now.getDate() - 2);

const initialUserData: UserData = {
    name: 'Артем',
    accounts: [
         { 
            id: 1, main: true, name: 'Зарплатная', balance: '0 ₽', badge: '129', iconName: 'ruble', iconBg: '#4A90E2',
            cardDesignUrl: 'https://i.imgur.com/Z6uwYH7.jpeg',
            cards: [
                {id: 'c1'}, {id: 'c2'}, {id: 'c3'}
            ]
        },
        { 
            id: 2, main: false, name: 'Переводы', balance: '0 ₽', badge: 'x1', 
            iconName: 'transfers', 
            iconBg: '#4A90E2', 
            cards: [],
            cardDesignUrl: undefined
        },
        { 
            id: 3, main: false, name: 'Сбор на другое', balance: '0 ₽', 
            iconName: 'three-dots', 
            iconBg: '#4A90E2', 
            cards: [],
            cardDesignUrl: undefined
        },
    ],
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
        { id: 1, name: 'Ксения К.', initials: 'КК', phone: '+79261234567', banks: [allBanks[0]] },
        { id: 2, name: 'Андрей Госов', initials: 'АГ', phone: '+79031234568', banks: [allBanks[1], allBanks[2]] },
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
    const [userData, setUserData] = useState<UserData>(initialUserData);

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
            onHistoryClick: () => setIsHistoryOpen(true)
        };

        switch (activeTab) {
            case 'main': return <MainScreen {...mainScreenProps} />;
            case 'payments': return <PaymentsScreen />;
            case 'city': return <PlaceholderScreen title="Город" />;
            case 'chat': return <PlaceholderScreen title="Чат" />;
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
        </>
    );
};