import { Hono } from 'npm:hono'
import { Env } from '../../types.ts'
import { requireHouseholdRole } from '../../middleware/householdAuth.ts'

const householdInvitesRouter = new Hono<Env>()

// Generowanie unikalnego kodu zaproszenia (np. INV-8X2P9K)
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'INV-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// POST / — Tworzenie nowego kodu zaproszenia (Wymaga: owner | editor)
householdInvitesRouter.post('/', requireHouseholdRole('owner', 'editor'), async (c) => {
    const householdId = c.req.param('id')
    const user = c.get('user')
    const supabase = c.get('supabase')

    const body = await c.req.json().catch(() => ({}))
    const { maxUses, expiresInDays } = body

    // 1. Wyliczenie expires_at na podstawie dni
    let expiresAt: string | null = null
    if (typeof expiresInDays === 'number' && expiresInDays > 0) {
        const date = new Date()
        date.setDate(date.getDate() + expiresInDays)
        expiresAt = date.toISOString()
    }

    // 2. Walidacja maxUses
    const parsedMaxUses = typeof maxUses === 'number' && maxUses > 0 ? maxUses : null

    // 3. Generowanie zaproszenia
    const code = generateInviteCode()

    const { data: invite, error } = await supabase
        .from('invite_codes')
        .insert({
            household_id: householdId,
            code,
            created_by: user.id,
            max_uses: parsedMaxUses,
            uses_count: 0,
            expires_at: expiresAt,
        })
        .select(`
      id,
      code,
      max_uses,
      uses_count,
      expires_at,
      created_at,
      created_by,
      profiles:created_by (
        name,
        email
      )
    `)
        .single()

    if (error) {
        return c.json({
            success: false,
            code: 'INVITE_CREATE_FAILED',
            message: error.message,
        }, 400)
    }

    // 4. Mapowanie odpowiedzi do tego samego formatu co w GET
    const formattedInvite = {
        id: invite.id,
        code: invite.code,
        max_uses: invite.max_uses,
        uses_count: invite.uses_count,
        expires_at: invite.expires_at,
        created_at: invite.created_at,
        created_by_id: invite.created_by,
        created_by_name: (invite.profiles as any)?.name ?? null,
        created_by_email: (invite.profiles as any)?.email ?? null,
    }

    return c.json({
        success: true,
        code: 'INVITE_CREATED',
        invite: formattedInvite,
    }, 201)
})

// GET / — Pobieranie listy zaproszeń dla domostwa (Wymaga: owner | editor)
householdInvitesRouter.get('/', requireHouseholdRole('owner', 'editor'), async (c) => {
  const householdId = c.req.param('id')
  const supabase = c.get('supabase')

  const { data: invites, error } = await supabase
    .from('invite_codes')
    .select(`
      id,
      code,
      max_uses,
      uses_count,
      expires_at,
      created_at,
      created_by,
      profiles:created_by (
        name,
        email
      )
    `)
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })

  if (error) {
    return c.json({
      success: false,
      code: 'INVITES_FETCH_FAILED',
      message: error.message,
    }, 400)
  }

  const formattedInvites = invites?.map((invite: any) => ({
    id: invite.id,
    code: invite.code,
    max_uses: invite.max_uses,
    uses_count: invite.uses_count,
    expires_at: invite.expires_at,
    created_at: invite.created_at,
    created_by_id: invite.created_by,
    created_by_name: invite.profiles?.name ?? null,
    created_by_email: invite.profiles?.email ?? null,
  })) || []

  return c.json({
    success: true,
    code: 'INVITES_FETCHED',
    invites: formattedInvites,
  })
})

// DELETE / — Usuwanie zaproszenia (Wymaga: owner | editor)
householdInvitesRouter.delete('/', requireHouseholdRole('owner', 'editor'), async (c) => {
  const householdId = c.req.param('id')
  const supabase = c.get('supabase')

  // 1. Pobieranie z Query Params (?inviteId=123 lub ?id=123)
  let inviteId = c.req.query('inviteId') || c.req.query('id')

  // 2. Jeśli brak w query params, próbujemy z JSON Body
  if (!inviteId) {
    const body = await c.req.json().catch(() => ({}))
    inviteId = body.inviteId || body.id
  }

  // Weryfikacja czy podano ID zaproszenia
  if (!inviteId) {
    return c.json({
      success: false,
      code: 'INVITE_ID_REQUIRED',
      message: 'Identyfikator zaproszenia jest wymagany w Query Param lub Body',
    }, 400)
  }

  const { error } = await supabase
    .from('invite_codes')
    .delete()
    .eq('id', inviteId)
    .eq('household_id', householdId)

  if (error) {
    return c.json({
      success: false,
      code: 'INVITE_DELETE_FAILED',
      message: error.message,
    }, 400)
  }

  return c.json({
    success: true,
    code: 'INVITE_DELETED',
    message: 'Zaproszenie zostało pomyślnie usunięte',
  })
})

export default householdInvitesRouter