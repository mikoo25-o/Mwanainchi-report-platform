import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  sw: 'Kiswahili (Swahili)',
  sh: 'Sheng (Kenyan urban slang)',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, targetLanguage } = body

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // Defaults to Swahili if no target specified
    const langCode = targetLanguage || 'sw'
    const target = LANGUAGE_NAMES[langCode] || 'Kiswahili (Swahili)'

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a precise translator for a Kenyan civic justice platform. Translate the user's text into ${target}. This text may be written in English, Kiswahili, or Sheng (Kenyan urban slang). Preserve the original meaning exactly — this is often a legal incident report, so accuracy matters. Do not add commentary, explanations, or quotation marks. Return only the translated text.`,
        },
        { role: 'user', content: text },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })

    const translated = completion.choices[0]?.message?.content?.trim() || ''

    return NextResponse.json({ translated, targetLanguage: target })
  } catch (err: any) {
    console.error('[TRANSLATE] Error:', err)
    if (err?.status === 401) {
      return NextResponse.json({ error: 'Invalid Groq API key' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Translation service unavailable' }, { status: 500 })
  }
}