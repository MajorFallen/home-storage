import { Hono } from 'npm:hono'
import { dbPublic } from '../config.ts'

const authRouter = new Hono()

// Funkcje pomocnicze/obsługi
const handleLogin = async (c: any) => {
  try {
    const { email, password } = await c.req.json().catch(() => ({}))

    if (!email || !password) {
      return c.json({
        success: false,
        code: 'AUTH_MISSING_CREDENTIALS',
        message: 'Email and password are required'
      }, 400)
    }

    const { data, error } = await dbPublic.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      return c.json({
        success: false,
        code: 'AUTH_INVALID_CREDENTIALS',
        message: error?.message || 'Invalid email or password'
      }, 401)
    }

    return c.json({
      success: true,
      code: 'AUTH_LOGIN_SUCCESS',
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400)
  }
}

const handleRegister = async (c: any) => {
  try {
    const { email, password, name } = await c.req.json().catch(() => ({}))

    if (!email || !password) {
      return c.json({
        success: false,
        code: 'AUTH_MISSING_CREDENTIALS',
        message: 'Email and password are required'
      }, 400)
    }

    const { data, error } = await dbPublic.auth.signUp({
      email,
      password,
      options: { data: { display_name: name || '' } }
    })

    if (error) {
      return c.json({
        success: false,
        code: 'AUTH_REGISTER_FAILED',
        message: error.message
      }, 400)
    }

    return c.json({
      success: true,
      code: 'AUTH_REGISTER_SUCCESS',
      user: data.user,
      session: data.session
    }, 201)
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400)
  }
}

const handleRefresh = async (c: any) => {
  try {
    const { refreshToken } = await c.req.json().catch(() => ({}))

    if (!refreshToken) {
      return c.json({
        success: false,
        code: 'AUTH_MISSING_TOKEN',
        message: 'Refresh token is required'
      }, 400)
    }

    const { data, error } = await dbPublic.auth.refreshSession({ refresh_token: refreshToken })

    if (error || !data.session) {
      return c.json({
        success: false,
        code: 'AUTH_REFRESH_FAILED',
        message: error?.message || 'Invalid refresh token'
      }, 401)
    }

    return c.json({
      success: true,
      code: 'AUTH_TOKEN_REFRESHED',
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400)
  }
}

// Rejestracja tras (zarówno krótkich, jak i z przedrostkiem)
authRouter.post('/login', handleLogin)

authRouter.post('/register', handleRegister)

authRouter.post('/refresh', handleRefresh)

export default authRouter