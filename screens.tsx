import React, { useState, useEffect, useRef } from 'react';
import { useActionHandler } from './hooks.tsx';
import type { MiniCardData } from './types.ts';
import { 
    Header, Stories, InfoCards, QuickActions, AccountCard, SearchIcon,
    TinkoffIcon, MobileIcon, PlusIcon, BillIcon, QRIcon, ArrowRightIcon,
    PhoneIcon, FromBankIcon, BetweenAccountsIcon, ByCardNumberIcon, ByContractIcon,
    HousingIcon, GovServicesIcon, CreditIcon, RequestMoneyIcon, RubleIcon,
    ThreeDotsIcon, RefreshIcon
} from './components.tsx';


export const MainScreen = () => {
    const handleAction = useActionHandler();
    const [isAnimated, setIsAnimated] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartY = useRef(0);
    const pullDistance = useRef(0);
    const mainRef = useRef<HTMLElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

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


    const [miniCards] = useState<MiniCardData[]>([
        { id: 1, type: 'yellow', last4: '5074' }, { id: 2, type: 'yellow', last4: '4000' },
        { id: 3, type: 'yellow', last4: '6647' }, { id: 4, type: 'yellow', last4: '5572' },
        { id: 5, type: 'black', last4: '6882' },
    ]);
     const accounts = [
        { id: 1, main: true, name: 'Зарплатная', balance: '0 ₽', badge: '129', icon: <RubleIcon />, iconBg: '#4A90E2' },
        { id: 2, name: 'Переводы', balance: '0 ₽', badge: 'x1', icon: <svg viewBox="0 0 24 24"><path fill="white" d="M20 18v-2h-8v2h8zm-8-3.5h8v-2h-8v2zM4 14.5v-11h14v11h-2V7H6v5.5H4z"/></svg>, iconBg: '#4A90E2' },
        { id: 3, name: 'Сбор на другое', balance: '0 ₽', icon: <ThreeDotsIcon />, iconBg: '#4A90E2' },
        { id: 4, name: 'Сбор на другое', balance: '0 из 100 000 000 ₽', icon: <ThreeDotsIcon />, iconBg: '#4A90E2' },
        { id: 5, name: 'Самозанятость', balance: '', icon: <svg viewBox="0 0 24 24"><path fill="white" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>, iconBg: '#50E3C2' },
        { id: 6, name: 'Мобильная связь', balance: 'T-Мобайл', icon: <svg viewBox="0 0 24 24"><path fill="white" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>, iconBg: '#F5A623' },
        { id: 7, name: 'Автокредит', balance: '1 500 000 ₽', icon: <svg viewBox="0 0 24 24"><path fill="white" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>, iconBg: '#7DC8E8' },
    ];
    return (
        <>
            <Header onAction={handleAction} />
            <main ref={mainRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div ref={indicatorRef} className={`pull-to-refresh-indicator ${isRefreshing ? 'refreshing' : ''}`} style={{ opacity: isRefreshing ? 1 : 0, transform: `translateY(${isRefreshing ? '40px' : '0px'})` }}>
                   <RefreshIcon />
                </div>
                <Stories onAction={handleAction} />
                <InfoCards onAction={handleAction} />
                <QuickActions onAction={handleAction} />
                <div className="accounts-list">
                    {accounts.map((acc, index) => (
                        <AccountCard key={acc.id} account={acc} miniCards={acc.main ? miniCards : undefined} isAnimated={isAnimated} animationIndex={index} onAction={handleAction} />
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

    const allSections = [favorites, transfers, payments, []];

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