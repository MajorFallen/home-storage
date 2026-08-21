import { Context, Next } from 'npm:hono'
import { dbAdmin } from '../config.ts'
import { Env } from '../types.ts'

export async function authMiddleware(c: Context<Env>, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    return c.json({
      success: false,
      code: 'AUTH_MISSING_HEADER',
      message: 'Missing Authorization header'
    }, 401)
  }

  const token = authHeader.replace('Bearer ', '')

  // Weryfikacja tokena z użyciem globalnego klienta admina z config.ts
  const { data: { user }, error } = await dbAdmin.auth.getUser(token)

  if (error || !user) {
    return c.json({
      success: false,
      code: 'AUTH_INVALID_TOKEN',
      message: error?.message || 'Invalid or expired token'
    }, 401)
  }

  // 2. Pobieramy name i role z bazy public.profiles
  const { data: profile } = await dbAdmin
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single()

  // 3. Zapisujemy w kontekście scalony obiekt
  c.set('user', {
    id: user.id,
    email: user.email,
    name: profile?.name,
    role: profile?.role
  })

  c.set('supabase', dbAdmin)

  await next()
}