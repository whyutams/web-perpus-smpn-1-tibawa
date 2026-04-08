'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    email: string | undefined
    username: string
    full_name: string
    role: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth')
            const data = await response.json()

            if (data.authenticated) {
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check error:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            const response = await fetch('/api/auth', {
                method: 'DELETE'
            })

            if (response.ok) {
                setUser(null)
                router.push('/login')
            }
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return {
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        refetch: checkAuth
    }
}