import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHouseholds } from '../features/households/context/HouseholdsContext';
import './EnteredHouseholdPage.css';

export const EnteredHouseholdPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { activeHousehold, selectHousehold, isLoading, error } = useHouseholds();

    useEffect(() => {
        if (id) {
            selectHousehold(id);
        }
    }, [id, selectHousehold]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="entered-household-error">
                <div className="alert-error">{error}</div>
                <button className="btn-secondary" onClick={() => navigate('/households')}>
                    Wróć do listy domostw
                </button>
            </div>
        );
    }

    if (!activeHousehold) {
        return null;
    }

    return (
        <div className="entered-household-page">
            <div className="household-content">
                <div className="placeholder-card">
                    <h3>Witaj w domostwie "{activeHousehold.name}"!</h3>
                    <p>
                        Tutaj pojawią się kolejne moduły takie jak zarządzanie członkami, zaproszenia, listy zakupów czy wspólne wydatki.
                    </p>
                </div>
            </div>
        </div>
    );
};