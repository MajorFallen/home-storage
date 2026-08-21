/* src/shared/components/SettingsModal/ThemeSelector/ThemeSelector.tsx */
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChoiceTile } from '../../../../shared/components/ui';
import styles from './ThemeSelector.module.css';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className={styles.grid} role="radiogroup" aria-label="Wybór motywu">
      {availableThemes.map((theme) => (
        <ChoiceTile
          key={theme.id}
          selected={theme.id === currentTheme}
          onClick={() => setTheme(theme.id)}
        >
          {theme.label}
        </ChoiceTile>
      ))}
    </div>
  );
};