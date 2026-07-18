import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  sw: 'Kiswahili (Swahili)',
  sh: 'Sheng (Kenyan urban slang)',
}

// Lazy initialization – only create client when the endpoint is actually called
let groqClient: Groq | null = null

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set')
    }
    groqClient = new Groq({ apiKey })
  }
  return groqClient
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

    // Get the Groq client – this will throw if the key is missing
    const client = getGroqClient()

    const completion = await client.chat.completions.create({
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

    // Provide clear feedback for missing key or invalid key
    if (err?.message?.includes('GROQ_API_KEY')) {
      return NextResponse.json(
        { error: 'Translation service is not configured (missing API key).' },
        { status: 500 }
      )
    }
    if (err?.status === 401) {
      return NextResponse.json({ error: 'Invalid Groq API key' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Translation service unavailable' }, { status: 500 })
  }
}