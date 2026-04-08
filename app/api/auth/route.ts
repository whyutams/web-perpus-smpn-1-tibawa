import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username dan password harus diisi' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        const { data: email, error: rpcError } = await supabase
            .rpc('get_email_by_username', { p_username: username })

        // console.log('=== DEBUG ===')
        // console.log('1. Username:', username)
        // console.log('2. Email from RPC:', email)
        // console.log('3. RPC Error:', rpcError)

        if (rpcError || !email) {
            console.error('RPC Error:', rpcError?.message)
            return NextResponse.json(
                { error: 'Username atau password salah' },
                { status: 401 }
            )
        }

        // console.log('4. Attempting signIn with email:', email)

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        })

        // console.log('5. SignIn Data:', !!data)
        // console.log('6. SignIn Error:', signInError?.message)
        // console.log(`7. Email: ${email} | Password: ${password} | Username: ${username}`)

        if (signInError) {
            console.error('Sign in error:', signInError)
            return NextResponse.json(
                { error: 'Username atau password salah' },
                { status: 401 }
            )
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

        return NextResponse.json({
            success: true,
            message: 'Login berhasil',
            user: {
                id: data.user.id,
                email: data.user.email,
                username: profile?.username,
                full_name: profile?.full_name,
                role: profile?.role,
            },
        })

    } catch (error: any) {
        console.error('Auth API error:', error?.message)
        return NextResponse.json(
            { error: 'Terjadi kesalahan server' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            )
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                username: profile?.username,
                full_name: profile?.full_name,
                role: profile?.role,
            },
        })

    } catch (error: any) {
        console.error('Get session error:', error?.message)
        return NextResponse.json(
            { error: 'Terjadi kesalahan server' },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const supabase = await createClient()

        const { error } = await supabase.auth.signOut()

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            message: 'Logout berhasil',
        })

    } catch (error: any) {
        console.error('Logout error:', error?.message)
        return NextResponse.json(
            { error: 'Gagal logout' },
            { status: 500 }
        )
    }
}