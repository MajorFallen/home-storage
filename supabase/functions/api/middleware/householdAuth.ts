import { Context, Next } from 'npm:hono'
import { dbAdmin } from '../config.ts'
import { Env } from '../types.ts'

export async function householdAuthMiddleware(c: Context<Env>, next: Next) {
  const householdId = c.req.param('id')
  const user = c.get('user')

  if (!householdId || !user) {
    return c.json({ success: false, message: 'Brak id domostwa' }, 400)
  }

  // Sprawdzamy czy użytkownik należy do tego domostwa
  const { data: member } = await dbAdmin
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) {
    return c.json({
      success: false,
      code: 'FORBIDDEN',
      message: 'Nie jesteś członkiem tego domostwa'
    }, 403)
  }

  await next()
}