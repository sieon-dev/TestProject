import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'

export async function findUserByUsername(username: string) {
  const { data } = await getSupabase()
    .from('users')
    .select('*')
    .eq('username', username)
    .single()
  return data
}

export async function createUser(username: string, password: string) {
  const password_hash = await bcrypt.hash(password, 10)
  const { data, error } = await getSupabase()
    .from('users')
    .insert({ username, password_hash })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const { count } = await getSupabase()
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('username', username)
  return (count ?? 0) > 0
}
