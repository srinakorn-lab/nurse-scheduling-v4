export type UserRole = 'admin' | 'ward'

export interface AuthUser {
  username: string
  department: string | null  // null = admin (ทุกแผนก)
  role: UserRole
  displayName: string
}

// credentials — เปลี่ยน password ได้ที่นี่
export const USERS: Record<string, { password: string; user: AuthUser }> = {
  admin: {
    password: 'admin1234',
    user: { username: 'admin', department: null, role: 'admin', displayName: 'ผู้ดูแลระบบ' },
  },
  ccu: {
    password: 'CCU',
    user: { username: 'ccu', department: 'CCU', role: 'ward', displayName: 'CCU วิกฤตหัวใจ' },
  },
  ncu: {
    password: 'NCU',
    user: { username: 'ncu', department: 'NCU', role: 'ward', displayName: 'NCU วิกฤตประสาท' },
  },
  icu: {
    password: 'ICU',
    user: { username: 'icu', department: 'ICU', role: 'ward', displayName: 'ICU วิกฤตทั่วไป' },
  },
}

const SESSION_KEY = 'nurse_session'

export function login(username: string, password: string): AuthUser | null {
  const entry = USERS[username.toLowerCase()]
  if (!entry || entry.password !== password) return null
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(entry.user))
  }
  return entry.user
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function getSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
