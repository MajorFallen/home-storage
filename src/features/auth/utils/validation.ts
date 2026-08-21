// src/features/auth/utils/validation.ts

export const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email jest wymagany';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Niepoprawny format email';
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return 'Hasło jest wymagane';
    if (password.length < 6) return 'Hasło musi mieć min. 6 znaków';
    return null;
};

export const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Imię jest wymagane';
    return null;
};