import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...data } = body

    if (action === 'signup') {
      const { email, password, firstName, lastName, phone, county } = data

      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
          },
        })

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        )
      }

      // Update profile
      const profileUpdate: Database['public']['Tables']['profiles']['Update'] = {
        phone,
        county,
        first_name: firstName,
        last_name: lastName,
      }

      await supabaseAdmin
        .from('profiles')
        .update(profileUpdate)
        .eq('id', authData.user.id)

      // Create welcome conversation
      const conversationInsert: Database['public']['Tables']['conversations']['Insert'] =
        {
          user_id: authData.user.id,
          support_type: 'platform',
          title: 'Welcome to Mwanainchi Report',
        }

      const { data: conv } = await supabaseAdmin
        .from('conversations')
        .insert(conversationInsert)
        .select()
        .single()

      if (conv) {
        const messageInsert: Database['public']['Tables']['conversation_messages']['Insert'] =
          {
            conversation_id: conv.id,
            sender_id: authData.user.id,
            sender_type: 'support',
            content: `Welcome to Mwanainchi Report, ${firstName}! 🇰🇪 Your account has been created successfully. Your identity is protected and all your data is encrypted. You can now report incidents, upload evidence, and connect with legal professionals. Feel free to reach out if you need help.`,
            is_read: false,
          }

        await supabaseAdmin
          .from('conversation_messages')
          .insert(messageInsert)
      }

      return NextResponse.json({
        user: authData.user,
      })
    }

    if (action === 'update-profile') {
      const {
        userId,
        firstName,
        lastName,
        phone,
        county,
        bio,
      } = data

      const profileUpdate: Database['public']['Tables']['profiles']['Update'] = {
        first_name: firstName,
        last_name: lastName,
        phone,
        county,
        bio,
        updated_at: new Date().toISOString(),
      }

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdate)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ profile })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (err) {
    console.error('Auth API error:', err)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}