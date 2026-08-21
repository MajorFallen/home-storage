// src/shared/components/ui/Alert.tsx
import React from 'react';

interface AlertProps {
    type?: 'error' | 'success' | 'info';
    children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type = 'error', children }) => {
    return <div className={`alert-${type}`}>{children}</div>;
};