import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouseholds } from '../context/HouseholdsContext';
import { type HouseholdDTO } from '../types/households.types';

export const useHouseholdCard = (item: HouseholdDTO) => {
  const { id, name, created_at } = item;
  const { deleteHousehold } = useHouseholds();
  const navigate = useNavigate();

  const formattedDate = new Date(created_at).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleCardClick = () => {
    navigate(`/households/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm(`Czy na pewno chcesz usunąć domostwo "${name}"?`)) {
      await deleteHousehold(id);
    }
  };

  return {
    formattedDate,
    handleCardClick,
    handleDelete,
  };
};