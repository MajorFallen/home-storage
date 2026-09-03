// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './features/settings/theme/context/ThemeContext';
import { AuthProvider } from './features/auth/context/AuthContext';
import { UserProvider } from './features/user/context/UserContext';
import { HouseholdsProvider } from './features/households/context/HouseholdsContext';
import { InvitesProvider } from './features/households/invites/context/InvitesContext';
import { AppRoutes } from './app/routes/AppRoutes';
import './styles/global.css';

export const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <UserProvider>
                    <HouseholdsProvider>
                        <InvitesProvider>
                            <BrowserRouter>
                                <AppRoutes />
                            </BrowserRouter>
                        </InvitesProvider>    
                    </HouseholdsProvider>
                </UserProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;