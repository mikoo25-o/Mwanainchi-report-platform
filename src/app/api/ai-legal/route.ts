import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a legal aid assistant for Mwanainchi Report, a civic justice platform in Kenya. 
Your role is to provide basic legal guidance to Kenyan citizens.

IMPORTANT RULES:
- You are NOT a substitute for a qualified lawyer
- Always recommend consulting a real lawyer for serious matters
- Base your answers on Kenyan law (Constitution of Kenya 2010, Penal Code, etc.)
- Be compassionate — users may be in distress
- Respond in the language the user writes in (English, Kiswahili, or Sheng)
- Keep responses clear, practical, and empowering
- You can help with: understanding rights, explaining legal processes, drafting basic documents, explaining court procedures
- Never provide advice that could endanger the user
- Always remind users of emergency services (999) if safety is at risk

You can help users:
1. Understand their constitutional rights
2. Know what to do after an incident
3. Understand court procedures in Kenya
4. Draft basic documents (demand letters, affidavits)
5. Know when and how to report crimes
6. Understand the legal process for their case type`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, userId, conversationId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.'

    // Save the AI response to conversation if provided
    if (conversationId && userId) {
      await supabaseAdmin
        .from('conversation_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          sender_type: 'ai',
          content: aiResponse,
          is_read: false,
        })

      await supabaseAdmin
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
    }

    return NextResponse.json({ response: aiResponse })
  } catch (err: any) {
    console.error('AI API error:', err)
    if (err?.status === 401) {
      return NextResponse.json({ error: 'Invalid OpenAI API key' }, { status: 401 })
    }
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
  }
}
