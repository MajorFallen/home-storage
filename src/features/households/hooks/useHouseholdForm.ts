import { useState } from 'react';
import { useHouseholds } from '../context/HouseholdsContext';

export const useHouseholdForm = () => {
  const { createHousehold } = useHouseholds();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Nazwa domostwa jest wymagana');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const success = await createHousehold(name.trim());
      if (success) {
        setName(''); // Czyszczenie pola po sukcesie
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    error,
    isSubmitting,
    handleNameChange,
    handleSubmit,
  };
};