import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { authMiddleware } from './middleware/auth.ts'
import  authRouter  from './routes/auth.ts'
import  householdRouter  from './routes/households/index.ts'
import { Env } from './types.ts'

const app = new Hono<Env>().basePath('/api')

// 1. Obsługa CORS (Musi być na samej górze)
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  })
)

// 2. Globalna obsługa błędów
app.onError((err, c) => {
  console.error('[SERVER ERROR]:', err)
  return c.json(
    { success: false, code: 'SERVER_ERROR', message: err.message || 'Internal Server Error' },
    500
  )
})

// 3. Własna obsługa 404 (zamiast czystego tekstu zwraca czytelny JSON)
app.notFound((c) => {
  return c.json(
    {
      success: false,
      code: 'NOT_FOUND',
      message: `Nie znaleziono trasy: ${c.req.method} ${c.req.path}`
    },
    404
  )
})

// 3. MIDDLEWARE AUTORYZACJI — pomija trasę, jeśli zapytanie idzie do /auth/
app.use('*', async (c, next) => {
  if (c.req.path.includes('/auth/')) {
    return await next() // Publiczna trasa -> przejdź dalej bez weryfikacji JWT
  }
  return await authMiddleware(c, next) // Chroniona trasa -> wymagaj tokena
})

// 4. TRASY PUBLICZNE (/auth/login, /auth/register, /auth/refresh)
app.route('/auth', authRouter)

// 5. TRASY CHRONIONE
app.get('/me', (c) => {
  const user = c.get('user')
  return c.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  })
})

app.route('/households', householdRouter)

Deno.serve(app.fetch)