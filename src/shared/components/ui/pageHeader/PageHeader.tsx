import React from 'react';
import { Card } from '../card/Card';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'stack' | 'row';
}

export const PageHeaderContainer: React.FC<PageHeaderProps> = ({
  children,
  className = '',
  layout = 'stack',
}) => {
  const cardLayout = layout === 'row' ? 'row' : 'column';

  return (
    <Card
      layout={cardLayout}
      className={`${styles.container} ${layout === 'row' ? styles.rowLayout : ''} ${className}`}
    >
      {children}
    </Card>
  );
};

export const PageHeaderGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${styles.group} ${className}`}>{children}</div>;

export const PageHeaderActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${styles.actionsGroup} ${className}`}>{children}</div>;

export const PageHeaderTop: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${styles.top} ${className}`}>{children}</div>;

export const PageHeaderTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h1 className={`${styles.title} ${className}`}>{children}</h1>;

export const PageHeaderText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <span className={`${styles.text} ${className}`}>{children}</span>;

export const PageHeaderMuted: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <span className={`${styles.muted} ${className}`}>{children}</span>;

export const PageHeaderMeta: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${styles.meta} ${className}`}>{children}</div>;

export const PageHeaderMetaItem: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <span className={styles.metaItem}>
    <strong>{label}:</strong> {value || '-'}
  </span>
);

export const PageHeaderFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${styles.footer} ${className}`}>{children}</div>;

export const PageHeader = Object.assign(PageHeaderContainer, {
  Group: PageHeaderGroup,
  Actions: PageHeaderActions,
  Top: PageHeaderTop,
  Title: PageHeaderTitle,
  Text: PageHeaderText,
  Muted: PageHeaderMuted,
  Meta: PageHeaderMeta,
  MetaItem: PageHeaderMetaItem,
  Footer: PageHeaderFooter,
});