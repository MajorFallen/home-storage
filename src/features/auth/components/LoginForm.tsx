import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { Input, Button, Alert } from '../../../shared/components/ui';

export const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    apiError,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {apiError && <Alert type="error">{apiError}</Alert>}

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Log in
      </Button>
    </form>
  );
};