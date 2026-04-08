import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
// import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { ip, post_id, get_all } = body

        // const headersList = await headers()
        // const ip =
        //     headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
        //     headersList.get('x-real-ip') ||
        //     headersList.get('cf-connecting-ip') ||
        //     'unknown'

        if (!ip || ip === 'unknown') {
            return NextResponse.json(
                { success: false, error: 'Unable to determine IP or IP is missing' },
                { status: 400 }
            )
        }

        let existingQuery = supabase
            .from('viewers')
            .select('ip, created_at')
            .eq('ip', ip)

        if (post_id) {
            existingQuery = existingQuery.eq('post_id', post_id)
        } else {
            existingQuery = existingQuery.is('post_id', null)
        }

        const { data: existing } = await existingQuery.maybeSingle()

        let record = existing as unknown as any

        if (!existing) {
            const insertData: any = { ip }
            if (post_id) {
                insertData.post_id = post_id
            }

            const { data: inserted, error } = await supabase
                .from('viewers')
                .insert(insertData)
                .select('ip, created_at')
                .single()

            if (error) {
                console.error('Error inserting viewer:', error.message)
                return NextResponse.json(
                    { success: false, error: 'Failed to track visitor' },
                    { status: 500 }
                )
            }
            
            record = inserted
        }

        if (get_all) {
            let countQuery = supabase
                .from('viewers')
                .select('*', { count: 'exact', head: true })

            if (post_id) {
                countQuery = countQuery.eq('post_id', post_id)
            } else {
                countQuery = countQuery.is('post_id', null)
            }

            const { count } = await countQuery

            return NextResponse.json({
                success: true,
                count: count || 0,
                data: {
                    ip: record.ip,
                    created_at: record.created_at,
                    already_exists: !!existing
                }
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                ip: record.ip,
                created_at: record.created_at,
                already_exists: !!existing
            }
        })

    } catch (error: any) {
        console.error('Unexpected error in track-visitor API:', error.message)
        return NextResponse.json(
            { success: false, error: 'Internal server error or Invalid JSON' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const searchParams = request.nextUrl.searchParams
        const post_id = searchParams.get('post_id')

        let query = supabase
            .from('viewers')
            .select('*', { count: 'exact', head: true })

        if (post_id) {
            query = query.eq('post_id', post_id)
        } else {
            query = query.is('post_id', null)
        }

        const { count, error } = await query

        if (error) {
            return NextResponse.json(
                { success: false, error: 'Failed to get count' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            count: count || 0
        })

    } catch (error: any) {
        console.error('Unexpected error in get count:', error?.message)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}