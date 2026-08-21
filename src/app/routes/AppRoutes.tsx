// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../../layouts/MainLayout';
import { HouseholdLayout } from '../../layouts/HouseholdLayout';
import { LoginPage } from '../../pages/LoginPage';
import { HouseholdsPage } from '../../pages/HouseholdsPage';
import { EnteredHouseholdPage } from '../../pages/EnteredHouseholdPage';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Trasa publiczna */}
            <Route path="/login" element={<LoginPage />} />

            {/* Trasy chronione z wykorzystaniem wspólnego MainLayout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/households" element={<HouseholdsPage />} />
                    <Route element={<HouseholdLayout />}>
                        <Route path="/households/:id" element={<EnteredHouseholdPage />} />
                        {/* W przyszłości łatwo dodasz tu kolejne podstrony: */}
                        {/* <Route path="/households/:id/expenses" element={<ExpensesPage />} /> */}
                        {/* <Route path="/households/:id/members" element={<MembersPage />} /> */}
                    </Route>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/households" replace />} />
        </Routes>
    );
};