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
  const serializedBody =
    typeof body === 'string' || body instanceof FormData
      ? body
      : body
      ? JSON.stringify(body)
      : undefined;

  const fullUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(fullUrl, {
    ...restConfig,
    headers,
    body: serializedBody,
  });

  if (response.status === 401 && requiresAuth) {
    await tokenService.clearSession();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Sesja wygasła lub została unieważniona');
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!isJson) {
    const rawText = await response.text();
    console.error(`[httpClient Error] Otrzymano nie-JSON pod adresem ${fullUrl}:`, rawText);
    
    throw new Error(
      `Serwer zwrócił niepoprawny format odpowiedzi (${response.status} ${response.statusText}). Sprawdź czy VITE_API_URL jest poprawnie skonfigurowana.`
    );
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Błąd zapytania');

  return data as T;
}