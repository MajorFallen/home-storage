/* src/features/households/components/HouseholdHeader/HouseholdHeader.tsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouseholds } from '../context/HouseholdsContext';
import { Button, PageHeader } from '../../../shared/components/ui';
import { HouseholdRoleBadge } from './badges/HouseholdRoleBadge';

export const HouseholdHeader: React.FC = () => {
  const { activeHousehold } = useHouseholds();
  const navigate = useNavigate();

  if (!activeHousehold) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <PageHeader>
      <PageHeader.Top>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/households')}
        >
          ← Return to households list
        </Button>

        {activeHousehold.role && (
          <HouseholdRoleBadge
            role={activeHousehold.role}
            size="lg"
            shape="pill"
          />
        )}
      </PageHeader.Top>

      <PageHeader.Title>{activeHousehold.name}</PageHeader.Title>

      <PageHeader.Meta>
        <PageHeader.MetaItem
          label="Created at"
          value={formatDate(activeHousehold.created_at)}
        />
        <PageHeader.MetaItem
          label="Created by"
          value={activeHousehold.created_by_name || 'Unknown'}
        />
      </PageHeader.Meta>
    </PageHeader>
  );
};