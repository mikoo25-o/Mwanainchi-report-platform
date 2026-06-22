import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('support_type', 'ai')
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ conversation: existing })
    }

    const insertPayload: Database['public']['Tables']['conversations']['Insert'] = {
      user_id: userId,
      support_type: 'ai',
      title: 'AI Legal Aid',
    }

    const { data: conversation, error: insertError } = await supabaseAdmin
      .from('conversations')
      .insert(insertPayload)
      .select()
      .maybeSingle()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ conversation })
  } catch (err: any) {
    console.error('AI conversation creation error:', err)
    return NextResponse.json({ error: 'Unable to create AI conversation' }, { status: 500 })
  }
}
