import React, { useState, useRef, useLayoutEffect } from 'react';
import { MainScreen, PaymentsScreen } from './screens.tsx';
import { BottomNav, PlaceholderScreen, ProfileModal } from './components.tsx';
import type { TabName, UserData, Bank, Account } from './types.ts';

const tabOrder: TabName[] = ['main', 'payments', 'city', 'chat', 'more'];

const allBanks: Bank[] = [
    { id: 't-bank', name: 'Т-Банк', logoUrl: 'https://336118.selcdn.ru/Gutsy-Culebra/products/T-Bank-Seller-Logo.png' },
    { id: 'sber', name: 'Сбер', logoUrl: 'https://i.pinimg.com/1200x/92/ae/48/92/ae481096cfc19a71486694b627e11b.jpg' },
    { id: 'vtb', name: 'ВТБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/VTB_Logo_2018.svg/1200px-VTB_Logo_2018.png' },
];

const initialUserData: UserData = {
    name: 'Артем',
    accounts: [
         { 
            id: 1, main: true, name: 'Зарплатная', balance: '0 ₽', badge: '129', iconName: 'ruble', iconBg: '#4A90E2',
            cardDesignUrl: 'https://i.imgur.com/QrZADtb.png',
            cards: [
                {id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}
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
    ]
}


export const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabName>('main');
    const [animationClass, setAnimationClass] = useState('');
    const prevTabRef = useRef<TabName>('main');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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
        switch (activeTab) {
            case 'main': return <MainScreen userData={userData} setUserData={setUserData} onProfileClick={() => setIsProfileOpen(true)} isProfileOpen={isProfileOpen}/>;
            case 'payments': return <PaymentsScreen />;
            case 'city': return <PlaceholderScreen title="Город" />;
            case 'chat': return <PlaceholderScreen title="Чат" />;
            case 'more': return <PlaceholderScreen title="Ещё" />;
            default: return <MainScreen userData={userData} setUserData={setUserData} onProfileClick={() => setIsProfileOpen(true)} isProfileOpen={isProfileOpen} />;
        }
    };
    
    return (
        <>
            <div className={`page-container ${animationClass}`} key={activeTab}>
                {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userData={userData} setUserData={setUserData}/>
        </>
    );
};