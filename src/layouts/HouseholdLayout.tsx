// src/layouts/HouseholdLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { HouseholdHeader } from '../features/households/components/HouseholdHeader';

export const HouseholdLayout: React.FC = () => {
    return (
        <div className="dashboard-container">
            <HouseholdHeader />
            <main className="main-content">
                {/* W miejscu <Outlet /> React Router wyrenderuje dopasowaną podstronę */}
                <Outlet />
            </main>
        </div>
    );
};