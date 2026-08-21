import React, { useEffect } from 'react';
import { HouseholdCard } from '../features/households/components/HouseholdCard';
import { HouseholdForm } from '../features/households/components/HouseholdForm';
import { useHouseholds } from '../features/households/context/HouseholdsContext';
import './HouseholdsPage.css';

export const HouseholdsPage: React.FC = () => {
    const { households, isLoading, error, selectHousehold } = useHouseholds();

    useEffect(() => {
        // Resetowanie aktywnego domostwa po powrocie do listy
        selectHousehold(null);
    }, [selectHousehold]);

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h2>Twoje Domostwa</h2>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <HouseholdForm />

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : households.length === 0 ? (
                <div className="empty-state">
                    <p>Nie jesteś jeszcze członkiem żadnego domostwa.</p>
                    <p>Utwórz pierwsze domostwo za pomocą formularza powyżej.</p>
                </div>
            ) : (
                <div className="grid-container">
                    {households.map((item) => (
                        <HouseholdCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};