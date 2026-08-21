import React from 'react';
import { useHouseholdForm } from '../hooks/useHouseholdForm';
import { Card, Input, Button } from '../../../shared/components/ui';
import styles from './HouseholdForm.module.css';

export const HouseholdForm: React.FC = () => {
  const {
    name,
    error,
    isSubmitting,
    handleNameChange,
    handleSubmit,
  } = useHouseholdForm();

  return (
    <Card className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputWrapper}>
          <Input
            id="household-name"
            label="New Household"
            type="text"
            placeholder="np. Grandma Storage"
            value={name}
            onChange={handleNameChange}
            error={error}
          />
        </div>

        <div className={styles.buttonWrapper}>
          <Button type="submit" isLoading={isSubmitting}>
            Create Household
          </Button>
        </div>
      </form>
    </Card>
  );
};