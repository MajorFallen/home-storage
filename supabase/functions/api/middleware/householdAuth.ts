import { Context, Next } from 'npm:hono'
import { dbAdmin } from '../config.ts'
import { Env } from '../types.ts'

export async function householdAuthMiddleware(c: Context<Env>, next: Next) {
  const householdId = c.req.param('id') || c.req.param('householdId')
  const user = c.get('user')

  if (!householdId || !user) {
    return c.json({ success: false, code: 'HOUSEHOLD_ID_REQUIRED', message: 'Brak id domostwa' }, 400)
  }

  const { data: member, error } = await dbAdmin
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !member) {
    return c.json({
      success: false,
      code: 'FORBIDDEN',
      message: 'Nie jesteś członkiem tego domostwa',
    }, 403)
  }

  // Zapisujemy rolę członka w kontekście Hono
  c.set('memberRole', member.role)

  await next()
}

// Funkcja pomocnicza do sprawdzania konkretnych ról
export function requireHouseholdRole(...allowedRoles: Array<'owner' | 'editor' | 'member'>) {
  return async (c: Context<Env>, next: Next) => {
    const role = c.get('memberRole')

    if (!role || !allowedRoles.includes(role)) {
      return c.json({
        success: false,
        code: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS',
        message: 'Brak wystarczających uprawnień do wykonania tej akcji',
      }, 403)
    }

    await next()
  }
}