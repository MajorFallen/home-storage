// src/shared/components/ui/alert/Alert.tsx
import React from 'react';
import styles from './Alert.module.css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'error' | 'success' | 'info' | 'warning';
    title?: string;
    children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
                                                type = 'error',
                                                title,
                                                className = '',
                                                children,
                                                ...props
                                            }) => {
    const alertClasses = [
        styles.alert,
        styles[type],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={alertClasses} role="alert" {...props}>
            {title && <h4 className={styles.title}>{title}</h4>}
            <div className={styles.content}>{children}</div>
        </div>
    );
};