// src/shared/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    id,
    className = '',
    ...props // przekazuje pozostałe atrybuty (value, onChange, placeholder itp.)
}) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                id={id}
                className={`${error ? 'error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};