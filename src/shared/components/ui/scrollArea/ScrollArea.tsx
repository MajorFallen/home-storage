import React from 'react';
import styles from './ScrollArea.module.css';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    maxHeight?: string | number;
    gap?: string | number;
    isLoading?: boolean;
    isEmpty?: boolean;
    loadingMessage?: React.ReactNode;
    emptyMessage?: React.ReactNode;
    children: React.ReactNode;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
                                                          maxHeight = '400px',
                                                          gap,
                                                          isLoading = false,
                                                          isEmpty = false,
                                                          loadingMessage = 'Wczytywanie danych...',
                                                          emptyMessage = 'Brak danych do wyświetlenia.',
                                                          className = '',
                                                          children,
                                                          style,
                                                          ...props
                                                      }) => {
    const renderContent = () => {
        if (isLoading) {
            return <div className={styles.stateContainer}>{loadingMessage}</div>;
        }

        if (isEmpty) {
            return <div className={styles.emptyState}>{emptyMessage}</div>;
        }

        return children;
    };

    return (
        <div
            className={`${styles.scrollArea} ${className}`}
            style={{ maxHeight, ...style }}
            {...props}
        >
            <div
                className={styles.viewport}
                style={gap !== undefined ? { gap } : undefined}
            >
                {renderContent()}
            </div>
        </div>
    );
};