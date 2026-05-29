import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { findUserByUsername, createUser, verifyPassword, isUsernameTaken } from '@/repositories/authRepository'
import { sessionOptions, type SessionData } from '@/lib/session'

const DEFAULT_ADMIN = { username: 'admin', password: 'admin1234' }

// admin 계정이 DB에 없으면 자동 생성
async function ensureAdminExists() {
  const admin = await findUserByUsername(DEFAULT_ADMIN.username)
  if (!admin) {
    await createUser(DEFAULT_ADMIN.username, DEFAULT_ADMIN.password)
  }
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!username?.trim()) return { success: false, error: '아이디를 입력해주세요.' }
  if (!password) return { success: false, error: '비밀번호를 입력해주세요.' }

  // admin 계정 자동 시드
  if (username.trim() === DEFAULT_ADMIN.username) {
    await ensureAdminExists()
  }

  const user = await findUserByUsername(username.trim())
  console.log('[login] user found:', user ? user.username : null)
  if (!user) return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }

  const valid = await verifyPassword(password, user.password_hash)
  console.log('[login] password valid:', valid)
  if (!valid) return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.isLoggedIn = true
  session.username = user.username
  await session.save()

  return { success: true }
}

export async function signup(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!username?.trim()) return { success: false, error: '아이디를 입력해주세요.' }
  if (username.trim().length < 3) return { success: false, error: '아이디는 3자 이상이어야 합니다.' }
  if (!password) return { success: false, error: '비밀번호를 입력해주세요.' }
  if (password.length < 6) return { success: false, error: '비밀번호는 6자 이상이어야 합니다.' }

  const taken = await isUsernameTaken(username.trim())
  if (taken) return { success: false, error: '이미 사용 중인 아이디입니다.' }

  await createUser(username.trim(), password)
  return { success: true }
}

export async function logout(): Promise<void> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.destroy()
}

export async function getSession(): Promise<SessionData | null> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) return null
  return session
}
