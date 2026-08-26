// src/pages/HouseholdsPage.tsx (lub odpowiednia ścieżka widoku)
import React, { useEffect } from 'react';
import { HouseholdCard } from '../features/households/components/HouseholdCard';
import { HouseholdForm } from '../features/households/components/HouseholdForm';
import { JoinHouseholdAction } from '../features/households/components/buttons/JoinHouseholdButton';
import { useHouseholds } from '../features/households/context/HouseholdsContext';
import './HouseholdsPage.css';

export const HouseholdsPage: React.FC = () => {
    const { households, isLoading, error, selectHousehold } = useHouseholds();

    useEffect(() => {
        selectHousehold(null);
    }, [selectHousehold]);

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h2>Your households</h2>
                <JoinHouseholdAction />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <HouseholdForm />

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : households.length === 0 ? (
                <div className="empty-state">
                    <p>You are not a member of any household yet.</p>
                    <p>Create or join your first household.</p>
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