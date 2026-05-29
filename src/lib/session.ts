export interface SessionData {
  isLoggedIn: boolean
  username: string
}

export const sessionOptions = {
  password: 'order-admin-session-secret-key-must-be-32chars!!',
  cookieName: 'order-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}
