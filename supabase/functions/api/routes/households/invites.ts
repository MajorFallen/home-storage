import { Hono } from 'npm:hono'
import { Env } from '../../types.ts'

export const householdInvitesRouter = new Hono<Env>()

// Dołączenie do domostwa na podstawie kodu (nie wymaga uprzedniego członkostwa)
// POST /api/invites/join
householdInvitesRouter.post('/', (c) => {
  // Walidacja kodu i dodanie do household_members
})

// Weryfikacja kodu zaproszenia przed dołączeniem (pobranie nazwy domostwa)
// GET /api/invites/:code
householdInvitesRouter.get('/', (c) => {
  // Sprawdzenie czy kod jest ważny
})

// Generowanie kodu zaproszenia (wymaga bycia członkiem/administratorem danego domostwa)
// POST /api/invites/households/:id
householdInvitesRouter.post('/', (c) => {
  // Tworzenie nowego wiersza w invite_codes dla domostwa :id
})

export default householdInvitesRouter