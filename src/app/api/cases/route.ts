import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId, category, incidentType, incidentDate, incidentTime,
      location, description, involvedDescription, victimSelf,
      hasWitnesses, policeReported, legalRepresentation,
      preferredLanguage, additionalContext, isAnonymous,
    } = body

    if (!userId || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('cases')
      .insert({
        user_id: userId,
        category,
        incident_type: incidentType || null,
        incident_date: incidentDate || null,
        incident_time: incidentTime || null,
        location: location || null,
        description,
        involved_description: involvedDescription || null,
        victim_self: victimSelf ?? true,
        has_witnesses: hasWitnesses ?? false,
        police_reported: policeReported || null,
        legal_representation: legalRepresentation || null,
        preferred_language: preferredLanguage || 'English',
        additional_context: additionalContext || null,
        is_anonymous: isAnonymous ?? false,
        status: 'submitted',
      })
      .select()
      .single()

    if (error) {
      console.error('Case creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create welcome conversation for the user
    const { data: conv } = await supabaseAdmin
      .from('conversations')
      .insert({
        user_id: userId,
        support_type: 'platform',
        title: 'Case Support',
      })
      .select()
      .single()

    if (conv) {
      // Get platform support user id (or use a system id)
      const systemUserId = userId // fallback — in production use a real support account id
      await supabaseAdmin
        .from('conversation_messages')
        .insert({
          conversation_id: conv.id,
          sender_id: systemUserId,
          sender_type: 'support',
          content: `Your case has been received successfully. Case ID: ${data.case_number}. Our team will review your report and get back to you shortly.`,
          is_read: false,
        })
    }

    return NextResponse.json({ case: data, caseNumber: data.case_number })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('cases')
      .select('*, evidence(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ cases: data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
