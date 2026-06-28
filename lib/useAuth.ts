'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout, type AuthUser } from './auth'

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session && requireAuth) {
      router.replace('/login')
      return
    }
    setUser(session)
    setLoading(false)
  }, [router, requireAuth])

  function signOut() {
    logout()
    router.push('/login')
  }

  return { user, loading, signOut }
}
