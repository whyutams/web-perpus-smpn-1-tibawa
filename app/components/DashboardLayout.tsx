'use client'

import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
{/* Components */ }
import DashboardHeader from './DashboardHeader'
{/* Components End */ }

interface DashboardLayoutProps {
    children: React.ReactNode
    user: {
        id: string
        email: string | undefined
        username: string
        full_name: string
        role: string
        avatar_url: string | null
    }
    generalSetting: any
}

export default function DashboardLayout({ children, user, generalSetting }: DashboardLayoutProps) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth', {
                method: 'DELETE'
            })

            if (response.ok) {
                NProgress.start()
                router.push('/login')
            }
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                user={user}
                generalSetting={generalSetting}
                onLogout={handleLogout}
            />
            <main className="pt-16">
                {children}
            </main>
        </div>
    )
}