'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let valid = true
    if (!username.trim()) {
      setUsernameError('아이디를 입력해주세요.')
      valid = false
    } else if (username.trim().length < 3) {
      setUsernameError('아이디는 3자 이상이어야 합니다.')
      valid = false
    } else {
      setUsernameError('')
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.')
      valid = false
    } else if (password.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.')
      valid = false
    } else {
      setPasswordError('')
    }

    if (!valid) return

    setLoading(true)
    setServerError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || '회원가입에 실패했습니다.')
        return
      }

      router.push('/login?signup=success')
    } catch {
      setServerError('서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
            <p className="mt-1 text-sm text-gray-500">관리자 계정을 생성합니다</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                아이디 <span className="text-gray-400 font-normal text-xs">(3자 이상)</span>
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setServerError('') }}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 ${
                  usernameError ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="아이디 입력"
              />
              {usernameError && <p className="mt-1 text-xs text-red-500">{usernameError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 <span className="text-gray-400 font-normal text-xs">(6자 이상)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); setServerError('') }}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition-colors focus:ring-2 ${
                    passwordError ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="비밀번호 입력"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
            </div>

            {serverError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              회원가입
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
