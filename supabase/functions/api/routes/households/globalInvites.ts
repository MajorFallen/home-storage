import { Hono } from 'npm:hono'
import { Env } from '../../types.ts'
import { dbAdmin } from '../../config.ts'

const globalInvitesRouter = new Hono<Env>()

// POST /join — Dołączanie do domostwa za pomocą kodu zaproszenia
globalInvitesRouter.post('/join', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  const { code } = await c.req.json().catch(() => ({}))

  if (!code || typeof code !== 'string' || code.trim() === '') {
    return c.json({
      success: false,
      code: 'INVITE_CODE_REQUIRED',
      message: 'Kod zaproszenia jest wymagany',
    }, 400)
  }

  const cleanCode = code.trim().toUpperCase()

  // 1. Pobieramy zaproszenie z bazy
  const { data: invite, error: inviteError } = await dbAdmin
    .from('invite_codes')
    .select('*')
    .eq('code', cleanCode)
    .maybeSingle()

  if (inviteError || !invite) {
    return c.json({
      success: false,
      code: 'INVITE_NOT_FOUND',
      message: 'Kod zaproszenia jest nieprawidłowy',
    }, 404)
  }

  // 2. Weryfikacja daty ważności (jeśli minęła -> USUŃ KOD)
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    await dbAdmin.from('invite_codes').delete().eq('id', invite.id)

    return c.json({
      success: false,
      code: 'INVITE_EXPIRED',
      message: 'Ten kod zaproszenia wygasł i został usunięty',
    }, 400)
  }

  // 3. Weryfikacja limitu użyć (jeśli osiągnięto przed dołączeniem -> USUŃ KOD)
  if (invite.max_uses !== null && invite.uses_count >= invite.max_uses) {
    await dbAdmin.from('invite_codes').delete().eq('id', invite.id)

    return c.json({
      success: false,
      code: 'INVITE_MAX_USES_REACHED',
      message: 'Ten kod zaproszenia osiągnął limit użyć i został usunięty',
    }, 400)
  }

  // 4. Sprawdzenie, czy użytkownik nie jest już członkiem domostwa
  const { data: existingMember } = await dbAdmin
    .from('household_members')
    .select('id')
    .eq('household_id', invite.household_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingMember) {
    return c.json({
      success: false,
      code: 'ALREADY_HOUSEHOLD_MEMBER',
      message: 'Jesteś już członkiem tego domostwa',
    }, 400)
  }

  // 5. Rejestracja członka w domostwie
  const { error: joinError } = await supabase
    .from('household_members')
    .insert({
      household_id: invite.household_id,
      user_id: user.id,
      role: 'member',
    })

  if (joinError) {
    return c.json({
      success: false,
      code: 'HOUSEHOLD_JOIN_FAILED',
      message: joinError.message,
    }, 400)
  }

  // 6. Aktualizacja użyć lub usunięcie kodu, jeśli osiągnięto limit po dołączeniu
  const newUsesCount = invite.uses_count + 1
  const isLimitReached = invite.max_uses !== null && newUsesCount >= invite.max_uses

  if (isLimitReached) {
    await dbAdmin.from('invite_codes').delete().eq('id', invite.id)
  } else {
    await dbAdmin
      .from('invite_codes')
      .update({ uses_count: newUsesCount })
      .eq('id', invite.id)
  }

  // 7. Pobieranie danych dołączonego domostwa
  const { data: household } = await supabase
    .from('households')
    .select('id, name, created_at')
    .eq('id', invite.household_id)
    .single()

  return c.json({
    success: true,
    code: 'HOUSEHOLD_JOINED_SUCCESSFULLY',
    household: {
      ...household,
      role: 'member',
    },
  }, 200)
})

export default globalInvitesRouter