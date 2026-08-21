// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserHeader } from '../features/user/components/UserHeader';

export const MainLayout: React.FC = () => {
    return (
        <div className="dashboard-container">
            <UserHeader />
            <main className="main-content">
                {/* W miejscu <Outlet /> React Router wyrenderuje dopasowaną podstronę */}
                <Outlet />
            </main>
        </div>
    );
};