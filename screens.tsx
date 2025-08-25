import React, { useState, useEffect, useRef } from 'react';
import { useActionHandler } from './hooks.tsx';
import type { UserData } from './types.ts';
import { 
    Header, Stories, InfoCards, QuickActions, AccountCard, SearchIcon,
    TinkoffIcon, MobileIcon, PlusIcon, BillIcon, QRIcon, ArrowRightIcon,
    PhoneIcon, FromBankIcon, BetweenAccountsIcon, ByCardNumberIcon, ByContractIcon,
    HousingIcon, GovServicesIcon, CreditIcon, RequestMoneyIcon
} from './components.tsx';

export const MainScreen: React.FC<{ userData: UserData; setUserData: React.Dispatch<React.SetStateAction<UserData>>; onProfileClick: () => void; isProfileOpen: boolean; }> = ({ userData, setUserData, onProfileClick, isProfileOpen }) => {
    const handleAction = useActionHandler();
    const [isAnimated, setIsAnimated] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartY = useRef(0);
    const pullDistance = useRef(0);
    const mainRef = useRef<HTMLElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

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

    const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
      if (mainRef.current?.scrollTop === 0) {
        touchStartY.current = e.targetTouches[0].clientY;
      }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
      if (mainRef.current?.scrollTop === 0 && touchStartY.current > 0) {
        const currentY = e.targetTouches[0].clientY;
        const distance = currentY - touchStartY.current;
        if (distance > 0) {
          e.preventDefault();
          pullDistance.current = distance;
          const indicator = indicatorRef.current;
          if (indicator) {
            const pullRatio = Math.min(distance / 100, 1);
            indicator.style.opacity = `${pullRatio}`;
            indicator.style.transform = `translateY(${Math.min(distance, 60)}px) rotate(${distance * 2}deg)`;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance.current > 80) {
        handleRefresh();
      }
      const indicator = indicatorRef.current;
      if(indicator) {
        indicator.style.opacity = '0';
        indicator.style.transform = `translateY(0px)`;
      }
      touchStartY.current = 0;
      pullDistance.current = 0;
    };

    return (
        <>
            <Header name={userData.name} onProfileClick={onProfileClick} isProfileOpen={isProfileOpen} onAction={handleAction} />
            <main ref={mainRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div ref={indicatorRef} className={`pull-to-refresh-indicator ${isRefreshing ? 'refreshing' : ''}`} style={{ opacity: isRefreshing ? 1 : 0, transform: `translateY(${isRefreshing ? '40px' : '0px'})` }}>
                   {/* <RefreshIcon /> */}
                </div>
                <Stories onAction={handleAction} />
                <InfoCards partners={userData.cashbackPartners} progress={userData.cashbackProgress} onAction={handleAction} />
                <QuickActions onAction={handleAction} />
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
                            <AccountCard account={acc} isAnimated={isAnimated} animationIndex={index} onAction={handleAction} />
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
        { label: 'Долгосроч. сбережения', icon: <TinkoffIcon /> }, { label: 'Ксения К.', icon: <TinkoffIcon /> },
        { label: 'Мобила', icon: <MobileIcon /> }, { label: 'Добавить', icon: <PlusIcon /> },
    ];
    const contacts = [
        { name: 'Себе', initials: 'С' }, { name: 'Настёна', initials: 'Н' },
        { name: '+7 980 908', initials: '?' }, { name: 'Андрей Госов', initials: 'АГ' },
        { name: 'Арт Бори', initials: 'АБ' },
    ];
    const transfers = [
        { label: 'Из другого банка', icon: <FromBankIcon /> }, { label: 'Между счетами', icon: <BetweenAccountsIcon /> },
        { label: 'По номеру карты', icon: <ByCardNumberIcon /> }, { label: 'По договору', icon: <ByContractIcon /> },
    ];
    const payments = [
        { label: 'Мобильная связь', icon: <MobileIcon /> }, { label: 'ЖКХ', icon: <HousingIcon /> },
        { label: 'Госуслуги', icon: <GovServicesIcon /> }, { label: 'Погашение кредита', icon: <CreditIcon /> },
    ];

    return (
        <>
            <header className="payments-header">
                <h1>Платежи</h1>
                <div className="search-bar">
                    <SearchIcon />
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
                    <a onClick={() => handleAction('На оплату')} className="payment-action-btn"><BillIcon /> На оплату</a>
                    <a onClick={() => handleAction('Сканировать QR')} className="payment-action-btn"><QRIcon /> Сканировать</a>
                </div>
                <section className={`section ${isAnimated ? 'animate-in' : ''}`} style={{ animationDelay: '150ms' }}>
                    <div className="section-header">
                        <h2 className="section-title">Перевод по телефону</h2>
                        <a onClick={() => handleAction('Открыть контакты')} className="section-action"><ArrowRightIcon /></a>
                    </div>
                    <div className="phone-transfer-input">
                        <PhoneIcon />
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
                        <div className="service-icon"><RequestMoneyIcon /></div>
                        <span>Запросить деньги</span>
                    </div>
                </section>
            </main>
        </>
    );
};