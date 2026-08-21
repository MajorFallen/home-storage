# Household Management Web App

A modular React and TypeScript web application for managing households inventory and expenses. Built with a feature-driven architecture, custom compound UI components, and dynamic theme tokens using CSS Modules. 

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS Modules, CSS Custom Properties (Multi-theme support)
- **Backend:** Supabase Edge Functions
- **Database & Auth:** Supabase (PostgreSQL)

## Architecture Overview

- **Modular UI:** Uses the Compound Components pattern for reusable, accessible UI elements (e.g., `PageHeader`, `Card`).
- **Domain-Driven Directory Structure:** Code is organized by domain features (`user`, `household`, `auth`) alongside shared UI components and hooks.
- **Serverless Backend:** Business logic runs on Supabase Edge Functions, keeping the frontend client lightweight.
- **Theming:** Full CSS variable token system allowing theme switching (e.g., light-emerald).

## Frontend Structure

```text
src/
├── app/              # Konfiguracja routingu i globalnych dostawców
├── assets/           # Obrazy, czcionki, ikony
├── features/         # Logika biznesowa podzielona na domeny
│   ├── auth/         # Autentykacja
│   ├── households/   # Zarządzanie domostwami
│   ├── settings/     # Ustawienia aplikacji i motywy
│   └── user/         # Profil i uprawnienia użytkownika
├── layouts/          # Szablony stron (np. MainLayout, AuthLayout)
├── pages/            # Widoki routingu (Strony)
├── shared/           # Uniwersalne komponenty UI, hooki i utilsy
│   └── components/ui/
├── styles/           # Motywy i style globalne
│   ├── themes/
│   └── global.css
├── App.tsx           # Główny komponent aplikacji
└── main.tsx          # Punkt wejścia (React DOM render)
