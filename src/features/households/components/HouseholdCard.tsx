/* src/features/households/components/HouseholdCard.tsx */
import React from 'react';
import { type HouseholdDTO } from '../types/households.types';
import { useHouseholdCard } from '../hooks/useHouseholdCard';
import { HouseholdRoleBadge } from './badges/HouseholdRoleBadge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  Button,
} from '../../../shared/components/ui';
import styles from './HouseholdCard.module.css';

interface HouseholdCardProps {
  item: HouseholdDTO;
}

export const HouseholdCard: React.FC<HouseholdCardProps> = ({ item }) => {
  const { name, role } = item;
  const { formattedDate, handleCardClick, handleDelete } = useHouseholdCard(item);

  return (
    <Card variant="default" interactive onClick={handleCardClick}>
      <CardHeader className={styles.headerLayout}>
        <CardTitle>{name}</CardTitle>
        <HouseholdRoleBadge role={role} />
      </CardHeader>

      <CardFooter className={styles.footerLayout}>
        <span className={styles.dateText}>Created at: {formattedDate}</span>
        <Button
          variant="ghost-danger"
          size="sm"
          onClick={handleDelete}
          title="Delete"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};