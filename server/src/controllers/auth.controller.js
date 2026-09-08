import * as authService from '../services/auth.service.js'

export async function postLogin(req, res) {
  const result = await authService.login(req.body)
  res.json(result)
}

// JWTs are stateless here, so there's nothing to invalidate server-side yet
// (no token blocklist/refresh-token store). This exists so the frontend's
// authApi.logout() call has somewhere to land; it just confirms the client
// should drop its token.
export async function postLogout(req, res) {
  res.json({ message: 'Logged out.' })
}

export async function getMe(req, res) {
  const user = await authService.getCurrentUser(req.user.sub)
  res.json(user)
}
