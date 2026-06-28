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
  w5a: {
    password: 'W5A',
    user: { username: 'w5a', department: 'W5A', role: 'ward', displayName: 'W.5A OBS DayCase' },
  },
  w6a: {
    password: 'W6A',
    user: { username: 'w6a', department: 'W6A', role: 'ward', displayName: 'W.6A อายุรกรรม' },
  },
  w6b: {
    password: 'W6B',
    user: { username: 'w6b', department: 'W6B', role: 'ward', displayName: 'W.6B ศัลยกรรม' },
  },
  w7a: {
    password: 'W7A',
    user: { username: 'w7a', department: 'W7A', role: 'ward', displayName: 'W.7A อายุรกรรม' },
  },
  w8a: {
    password: 'W8A',
    user: { username: 'w8a', department: 'W8A', role: 'ward', displayName: 'W.8A ศัลยกรรม' },
  },
  w9a: {
    password: 'W9A',
    user: { username: 'w9a', department: 'W9A', role: 'ward', displayName: 'W.9A อายุรกรรม' },
  },
  w10a: {
    password: 'W10A',
    user: { username: 'w10a', department: 'W10A', role: 'ward', displayName: 'W.10A อายุรกรรม' },
  },
  w11a: {
    password: 'W11A',
    user: { username: 'w11a', department: 'W11A', role: 'ward', displayName: 'W.11A อายุรกรรม' },
  },
  w12a: {
    password: 'W12A',
    user: { username: 'w12a', department: 'W12A', role: 'ward', displayName: 'W.12A อายุรกรรม' },
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
