import React, { useState } from 'react';
import { Button } from '..';
import styles from './CopyableCode.module.css';

interface CopyableCodeProps {
    code: string;
    className?: string;
}

export const CopyableCode: React.FC<CopyableCodeProps> = ({ code, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = async () => {
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Nie udało się skopiować kodu do schowka:', err);
        }
    };

    return (
        <div className={`${styles.codeContainer} ${className}`}>
            <code className={styles.codeDisplay}>{code}</code>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyCode}
            >
                {copied ? 'Copied!' : 'Copy'}
            </Button>
        </div>
    );
};