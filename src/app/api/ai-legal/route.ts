import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const SYSTEM_PROMPT = `You are the AI Legal Assistant for Mwanainchi Report, a civic justice platform in Kenya.

You provide clear, compassionate, basic legal information to people in Kenya.

Important rules:
- You are not a substitute for a qualified advocate or lawyer.
- Explain that serious, urgent, criminal, court, land, family, employment, or safety matters should be discussed with a qualified Kenyan lawyer.
- Base guidance on Kenyan law where possible, including the Constitution of Kenya 2010.
- Respond in the same language used by the user: English, Kiswahili, or Sheng.
- Do not invent laws, court decisions, contacts, or legal outcomes.
- Do not guarantee results.
- Ask short follow-up questions if important details are missing.
- Be supportive, respectful, practical, and easy to understand.
- If the user may be in immediate danger, advise them to contact emergency services on 999, 112, or 911 and seek help from trusted people.
- If the user reports violence, abuse, threats, sexual violence, or urgent danger, prioritise safety and encourage reporting to police or relevant support services.
- Never assist with crime, fraud, evading police, harming someone, or hiding evidence.

Use short paragraphs and practical numbered steps when useful.`

function getFallbackResponse(userMessage: string) {
  const message = userMessage.toLowerCase()

  if (
    message.includes('danger') ||
    message.includes('attack') ||
    message.includes('threat') ||
    message.includes('violence') ||
    message.includes('abuse') ||
    message.includes('emergency')
  ) {
    return `Your safety comes first.

1. If you are in immediate danger, call 999 or 112 now.
2. Move to a safer public place if you can.
3. Contact someone you trust and tell them where you are.
4. Keep any evidence safely, such as messages, photos, recordings, medical documents, or witness contacts.
5. You can create an emergency report on Mwanainchi Report for legal support follow-up.

The AI assistant is temporarily unavailable, but your message has been received.`
  }

  return `Thank you for your message.

The AI legal assistant is temporarily unavailable.

You can still use Mwanainchi Report to:
1. Submit a case report.
2. Upload evidence.
3. Track your case status.
4. Contact emergency services on 999 or 112 if the matter is urgent.

For serious legal matters involving police, court, land, family, employment, violence, or safety, please speak with a qualified Kenyan advocate or legal aid provider.`
}

async function saveAiMessage(
  conversationId: string,
  userId: string,
  content: string
) {
  const insertData: Database['public']['Tables']['conversation_messages']['Insert'] = {
    conversation_id: conversationId,
    sender_id: userId,
    sender_type: 'ai',
    content,
    is_read: false,
  }

  const { data, error } = await supabaseAdmin
    .from('conversation_messages')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Could not save AI message:', error)
    return null
  }

  const updateData: Database['public']['Tables']['conversations']['Update'] = {
    updated_at: new Date().toISOString(),
  }

  await supabaseAdmin
    .from('conversations')
    .update(updateData)
    .eq('id', conversationId)

  return data
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { messages, userId, conversationId } = body

    if (!userId || !conversationId) {
      return NextResponse.json(
        { error: 'userId and conversationId are required' },
        { status: 400 }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const safeMessages = messages
      .filter(
        (message: any) =>
          message &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0 &&
          (message.role === 'user' || message.role === 'assistant')
      )
      .slice(-20)
      .map((message: { role: 'user' | 'assistant'; content: string }) => ({
        role: message.role,
        content: message.content.trim(),
      }))

    const latestUserMessage =
      [...safeMessages]
        .reverse()
        .find((message) => message.role === 'user')
        ?.content || ''

    if (!process.env.GROQ_API_KEY) {
      const fallbackResponse = getFallbackResponse(latestUserMessage)

      const savedMessage = await saveAiMessage(
        conversationId,
        userId,
        fallbackResponse
      )

      return NextResponse.json({
        response: fallbackResponse,
        message: savedMessage,
        fallback: true,
      })
    }

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...safeMessages,
        ],
        temperature: 0.5,
        max_tokens: 800,
      })

      const aiResponse =
        completion.choices[0]?.message?.content?.trim() ||
        getFallbackResponse(latestUserMessage)

      const savedMessage = await saveAiMessage(
        conversationId,
        userId,
        aiResponse
      )

      return NextResponse.json({
        response: aiResponse,
        message: savedMessage,
      })
    } catch (groqError) {
      console.error('Groq API error:', groqError)

      const fallbackResponse = getFallbackResponse(latestUserMessage)

      const savedMessage = await saveAiMessage(
        conversationId,
        userId,
        fallbackResponse
      )

      return NextResponse.json({
        response: fallbackResponse,
        message: savedMessage,
        fallback: true,
        aiUnavailable: true,
      })
    }
  } catch (error) {
    console.error('AI legal route error:', error)

    return NextResponse.json(
      {
        error:
          'Unable to process this message right now. Please try again shortly.',
      },
      { status: 500 }
    )
  }
}