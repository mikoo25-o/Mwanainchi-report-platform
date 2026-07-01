import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { userId, latitude, longitude, accuracy } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('cases')
      .insert({
        user_id: userId,
        category: 'Emergency SOS',
        incident_type: 'Emergency SOS Alert',
        description:
          'Emergency SOS was activated from the Mwananchi Legal Aid platform. The user requested urgent assistance.',
        location: latitude !== null && longitude !== null
          ? `GPS location captured: ${latitude}, ${longitude}`
          : 'Location was not available or permission was not granted.',
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        location_accuracy: accuracy ?? null,
        status: 'submitted',
        victim_self: true,
        has_witnesses: false,
        is_anonymous: false,
      })
      .select()
      .single()

    if (error) {
      console.error('SOS case creation error:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      emergencyCase: data,
    })
  } catch (error: any) {
    console.error('SOS API error:', error)

    return NextResponse.json(
      { error: error.message || 'Unable to activate SOS' },
      { status: 500 }
    )
  }
}