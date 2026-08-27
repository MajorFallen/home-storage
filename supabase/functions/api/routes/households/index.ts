import { Hono } from 'npm:hono'
import { householdAuthMiddleware } from '../../middleware/householdAuth.ts'
import { Env } from '../../types.ts'
import householdInvitesRouter from './invites.ts'
import householdMembersRouter from './members.ts'
import globalInvitesRouter from './globalInvites.ts'


const householdsRouter = new Hono<Env>()

// GET / — Pobieranie listy domostw użytkownika
householdsRouter.get('/', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')

  // 1. Pobieramy rolę oraz dane domostwa (bez invite_code)
  const { data, error } = await supabase
    .from('household_members')
    .select(`
        role,
        households (
            id,
            name,
            created_at,
            created_by,
            profiles:created_by (
                name
            )
        )
    `)
    .eq('user_id', user.id);

  if (error) {
    return c.json({
      success: false,
      code: 'HOUSEHOLDS_FETCH_FAILED',
      message: error.message
    }, 400)
  }

  // 2. Mapujemy wynik na płaską strukturę obiektów
  const formattedHouseholds = data?.map((item: any) => ({
    id: item.households.id,
    name: item.households.name,
    created_at: item.households.created_at,
    created_by_id: item.households.created_by,
    created_by_name: item.households.profiles?.name ?? null,
    role: item.role, // dodajemy rolę użytkownika bezpośrednio do obiektu
  })) || []

  return c.json({
    success: true,
    code: 'HOUSEHOLDS_FETCHED',
    households: formattedHouseholds
  })
})

// POST / — Tworzenie nowego domostwa
householdsRouter.post('/', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  const { name } = await c.req.json().catch(() => ({}))

  if (!name || name.trim() === '') {
    return c.json({
      success: false,
      code: 'HOUSEHOLD_NAME_REQUIRED',
      message: 'Household name is required'
    }, 400)
  }

  const { data: household, error } = await supabase
    .from('households')
    .insert({ 
      name: name.trim(),
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    return c.json({
      success: false,
      code: 'HOUSEHOLD_CREATE_FAILED',
      message: error.message
    }, 400)
  }

  return c.json({
    success: true,
    code: 'HOUSEHOLD_CREATED',
    household
  }, 201)
})

// DELETE / — Usuwanie domostwa
householdsRouter.delete('/', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')

  // Opcja 1: Pobieranie z Query Params (?id=123)
  let householdId = c.req.query('id')

  // Opcja 2: Jeśli nie ma w query, próbujemy pobrać z JSON Body ({ "id": "123" })
  if (!householdId) {
    const body = await c.req.json().catch(() => ({}))
    householdId = body.id
  }

  // Weryfikacja czy podano ID
  if (!householdId) {
    return c.json({
      success: false,
      code: 'HOUSEHOLD_ID_REQUIRED',
      message: 'Identyfikator domostwa (id) jest wymagany w Query Param lub Body'
    }, 400)
  }

  // Weryfikacja czy użytkownik należy do domostwa i czy jest właścicielem (owner)
  const { data: member, error: memberError } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (memberError || !member) {
    return c.json({
      success: false,
      code: 'HOUSEHOLD_NOT_FOUND',
      message: 'Domostwo nie istnieje lub brak dostępu'
    }, 404)
  }

  if (member.role !== 'owner') {
    return c.json({
      success: false,
      code: 'FORBIDDEN_NOT_OWNER',
      message: 'Tylko właściciel może usunąć domostwo'
    }, 403)
  }

  // Usuwanie domostwa
  const { error: deleteError } = await supabase
    .from('households')
    .delete()
    .eq('id', householdId)

  if (deleteError) {
    return c.json({
      success: false,
      code: 'HOUSEHOLD_DELETE_FAILED',
      message: deleteError.message
    }, 400)
  }

  return c.json({
    success: true,
    code: 'HOUSEHOLD_DELETED',
    message: 'Domostwo zostało pomyślnie usunięte'
  })
})

// Middleware uruchomi się TYLKO, gdy :id jest fizycznie identyfikatorem UUID
// Ścieżki typu /invites, /join czy /search zostaną automatycznie pominięte!
householdsRouter.use('/:id{[0-9a-fA-F-]{36}}/*', householdAuthMiddleware)
householdsRouter.use('/:id{[0-9a-fA-F-]{36}}', householdAuthMiddleware)

// Teraz możesz deklarować trasy w DOWOLNEJ kolejności:
householdsRouter.route('/invites', globalInvitesRouter)
householdsRouter.route('/:id{[0-9a-fA-F-]{36}}/invites', householdInvitesRouter)
//householdsRouter.route('/:id/members', householdMembersRouter)

export default householdsRouter

