import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    // Get messages for a specific conversation
    if (conversationId) {
      const { data, error } = await supabaseAdmin
        .from('conversation_messages')
        .select('*, sender:profiles(first_name, last_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Mark as read
      await supabaseAdmin
        .from('conversation_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)

      return NextResponse.json({ messages: data })
    }

    // Get all conversations for user
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select(`
        *,
        conversation_messages (
          id, content, created_at, is_read, sender_type
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ conversations: data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { conversationId, senderId, content } = body

    if (!conversationId || !senderId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_type: 'user',
        content: content.trim(),
        is_read: false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update conversation updated_at
    await supabaseAdmin
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return NextResponse.json({ message: data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
