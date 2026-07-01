import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Get messages for one selected conversation
    if (conversationId) {
      const { data: conversation, error: conversationError } =
        await supabaseAdmin
          .from('conversations')
          .select('id, user_id')
          .eq('id', conversationId)
          .eq('user_id', userId)
          .maybeSingle()

      if (conversationError) {
        return NextResponse.json(
          { error: conversationError.message },
          { status: 500 }
        )
      }

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }

      const { data: messages, error: messagesError } =
        await supabaseAdmin
          .from('conversation_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

      if (messagesError) {
        return NextResponse.json(
          { error: messagesError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        messages: messages || [],
      })
    }

    // Get all conversations belonging to this user
    const { data: conversations, error: conversationsError } =
      await supabaseAdmin
        .from('conversations')
        .select(`
          id,
          title,
          support_type,
          updated_at,
          conversation_messages (
            id,
            content,
            sender_id,
            sender_type,
            is_read,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

    if (conversationsError) {
      return NextResponse.json(
        { error: conversationsError.message },
        { status: 500 }
      )
    }

    const sortedConversations = (conversations || []).map(
      (conversation: any) => ({
        ...conversation,
        conversation_messages: (
          conversation.conversation_messages || []
        ).sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        ),
      })
    )

    return NextResponse.json({
      conversations: sortedConversations,
    })
  } catch (error: any) {
    console.error('GET messages error:', error)

    return NextResponse.json(
      { error: 'Unable to load messages' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      conversationId,
      senderId,
      content,
    } = body

    if (!conversationId || !senderId || !content?.trim()) {
      return NextResponse.json(
        { error: 'conversationId, senderId and content are required' },
        { status: 400 }
      )
    }

    // Confirm the conversation belongs to the user sending the message
    const { data: conversation, error: conversationError } =
      await supabaseAdmin
        .from('conversations')
        .select('id, user_id, support_type')
        .eq('id', conversationId)
        .eq('user_id', senderId)
        .maybeSingle()

    if (conversationError) {
      return NextResponse.json(
        { error: conversationError.message },
        { status: 500 }
      )
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 403 }
      )
    }

    // Save the user's message
    const { data: message, error: messageError } =
      await supabaseAdmin
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

    if (messageError) {
      return NextResponse.json(
        { error: messageError.message },
        { status: 500 }
      )
    }

    // Update the conversation so it moves to the top of the chat list
    await supabaseAdmin
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId)

    return NextResponse.json({
      message,
      supportType: conversation.support_type,
    })
  } catch (error: any) {
    console.error('POST messages error:', error)

    return NextResponse.json(
      { error: 'Unable to send message' },
      { status: 500 }
    )
  }
}