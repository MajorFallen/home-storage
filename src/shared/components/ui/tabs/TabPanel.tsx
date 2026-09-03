import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import styles from './TabPanel.module.css';

export interface TabPanelProps {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
                                                      title,
                                                      description,
                                                      action,
                                                      isLoading,
                                                      children,
                                                      className = '',
                                                  }) => {
    return (
        <Card variant="default" className={`${styles.panelCard} ${className}`}>
            {(title || description || action) && (
                <CardHeader className={styles.header}>
                    <div className={styles.headerText}>
                        {title && <CardTitle className={styles.title}>{title}</CardTitle>}
                        {description && <p className={styles.description}>{description}</p>}
                    </div>
                    {action && <div className={styles.action}>{action}</div>}
                </CardHeader>
            )}

            <CardContent className={styles.content}>
                {isLoading ? (
                    <div className={styles.loader}>Wczytywanie danych...</div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
};