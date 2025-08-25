import React, { useState, useRef, useLayoutEffect } from 'react';
import { MainScreen, PaymentsScreen } from './screens.tsx';
import { BottomNav, PlaceholderScreen } from './components.tsx';
import type { TabName } from './types.ts';

const tabOrder: TabName[] = ['main', 'payments', 'city', 'chat', 'more'];

export const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabName>('main');
    const [animationClass, setAnimationClass] = useState('');
    const prevTabRef = useRef<TabName>('main');

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
            case 'main': return <MainScreen />;
            case 'payments': return <PaymentsScreen />;
            case 'city': return <PlaceholderScreen title="Город" />;
            case 'chat': return <PlaceholderScreen title="Чат" />;
            case 'more': return <PlaceholderScreen title="Ещё" />;
            default: return <MainScreen />;
        }
    };
    
    return (
        <>
            <div className={`page-container ${animationClass}`} key={activeTab}>
                {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
    );
};