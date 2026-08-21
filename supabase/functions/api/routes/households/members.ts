import { Hono } from 'npm:hono'
import { Env } from '../../types.ts'

const householdMembersRouter = new Hono<Env>()

// Dostępne pod: GET /api/households/:id/members
householdMembersRouter.get('/', (c) => {
  // Pobranie listy członków danego domostwa
})

// Dostępne pod: POST /api/households/:id/members/leave
householdMembersRouter.post('/leave', (c) => {
  // Wyjście zalogowanego użytkownika z domostwa
})

// Dostępne pod: DELETE /api/households/:id/members/:userId
householdMembersRouter.delete('/:userId', (c) => {
  // Usunięcie wybranego członka przez właściciela
})

export default householdMembersRouter