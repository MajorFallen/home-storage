// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Logowanie
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Rejestracja
                    </button>
                </div>

                {isLogin ? (
                    <LoginForm />
                ) : (
                    <RegisterForm onSuccess={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};