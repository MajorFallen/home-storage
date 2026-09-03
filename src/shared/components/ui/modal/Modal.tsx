import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '..';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card
        className={`${styles.modalCard} ${styles[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || Boolean(onClose)) && (
          <CardHeader className={styles.modalHeader}>
            {title && <CardTitle>{title}</CardTitle>}
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </Button>
            )}
          </CardHeader>
        )}

        <CardContent>{children}</CardContent>

        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
};