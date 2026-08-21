import React from 'react';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { Input, Button, Alert } from '../../../shared/components/ui';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    apiError,
    isSubmitting,
    handleSubmit,
  } = useRegisterForm({ onSuccess });

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {apiError && <Alert type="error">{apiError}</Alert>}

      <Input
        id="name"
        label="username"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Donald Trusk"
        error={errors.name}
      />

      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        error={errors.email}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={errors.password}
      />

      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        Register
      </Button>
    </form>
  );
};