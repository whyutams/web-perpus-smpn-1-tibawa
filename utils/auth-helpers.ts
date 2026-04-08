import { createClient } from '@/utils/supabase/server'

export async function getSession() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return {
        user: {
            id: user.id,
            email: user.email,
            username: profile?.username,
            full_name: profile?.full_name,
            role: profile?.role,
            avatar_url: profile?.avatar_url,
        },
        profile
    }
}

export async function requireAuth() {
    const session = await getSession()

    if (!session) {
        return null
    }

    return session
}

export async function requireRole(allowedRoles: string[]) {
    const session = await getSession()

    if (!session) {
        return { authorized: false, session: null }
    }

    const isAuthorized = allowedRoles.includes(session.user.role || '')

    return {
        authorized: isAuthorized,
        session: isAuthorized ? session : null
    }
}