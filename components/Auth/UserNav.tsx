'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Déconnexion réussie')
      window.location.href = '/'
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/history"
        className="text-sm text-gray-700 hover:text-gray-900"
      >
        Mes posts
      </Link>
      <span className="text-sm text-gray-600">{user.email}</span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:text-red-700 font-medium"
      >
        Déconnexion
      </button>
    </div>
  )
}
