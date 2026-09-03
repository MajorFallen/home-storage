// shared/components/ui/Tabs/Tabs.tsx
import React, { createContext, useContext, useState } from 'react';
import styles from './Tabs.module.css';

interface TabsContextProps {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

const useTabsContext = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Komponenty Tabs.* muszą być używane wewnątrz <Tabs>');
    }
    return context;
};

// 1. Główny kontener stanu
interface TabsProps {
    defaultValue: string;
    value?: string;
    onChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
                                              defaultValue,
                                              value,
                                              onChange,
                                              children,
                                              className = '',
                                          }) => {
    const [selectedTab, setSelectedTab] = useState(defaultValue);

    const activeTab = value !== undefined ? value : selectedTab;

    const setActiveTab = (newValue: string) => {
        if (value === undefined) {
            setSelectedTab(newValue);
        }
        onChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={`${styles.tabsRoot} ${className}`}>{children}</div>
        </TabsContext.Provider>
    );
};

// 2. Kontener dla przycisków
export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                          children,
                                                                                          className = '',
                                                                                      }) => {
    return <div className={`${styles.tabsList} ${className}`}>{children}</div>;
};

// 3. Pojedynczy przycisk zakładki
interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
                                                            value,
                                                            children,
                                                            disabled = false,
                                                            className = '',
                                                        }) => {
    const { activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            disabled={disabled}
            className={`${styles.tabsTrigger} ${isActive ? styles.active : ''} ${className}`}
            onClick={() => setActiveTab(value)}
        >
            {children}
        </button>
    );
};

// 4. Treść konkretnej zakładki
interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
                                                            value,
                                                            children,
                                                            className = '',
                                                        }) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== value) return null;

    return <div className={`${styles.tabsContent} ${className}`}>{children}</div>;
};