// src/shared/api/httpClient.ts
import { tokenService } from './tokenService';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Nadpisujemy 'body' w RequestInit, aby akceptowało dowolne obiekty JS
type HttpClientConfig = Omit<RequestInit, 'body'> & {
  requiresAuth?: boolean;
  body?: unknown;
};

export async function httpClient<T = unknown>(
  endpoint: string,
  config: HttpClientConfig = {}
): Promise<T> {
  const { requiresAuth = true, headers: customHeaders, body, ...restConfig } = config;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (requiresAuth) {
    const token = await tokenService.getValidAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Automatyczna serializacja: jeśli 'body' to obiekt, zamieniamy go na JSON
  const serializedBody = typeof body === 'string' || body instanceof FormData
    ? body
    : (body ? JSON.stringify(body) : undefined);

  const response = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...restConfig,
    headers,
    body: serializedBody,
  });

  if (response.status === 401 && requiresAuth) {
    await tokenService.clearSession();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Sesja wygasła lub została unieważniona');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Błąd zapytania');

  return data as T;
}