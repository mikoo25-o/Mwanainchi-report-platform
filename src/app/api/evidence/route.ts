import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const caseId = formData.get('caseId') as string
    const userId = formData.get('userId') as string
    const description = formData.get('description') as string

    if (!file || !caseId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Read file buffer
    const buffer = await file.arrayBuffer()
    const uint8 = new Uint8Array(buffer)

    // Generate SHA-256 hash for tamper detection
    const hash = createHash('sha256').update(uint8).digest('hex')

    // Upload to Supabase Storage
    const filePath = `${userId}/${caseId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('evidence')
      .upload(filePath, uint8, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData } = await supabaseAdmin.storage
      .from('evidence')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    // Save record to database
    const { data, error } = await supabaseAdmin
      .from('evidence')
      .insert({
        case_id: caseId,
        user_id: userId,
        file_name: file.name,
        file_url: urlData?.signedUrl || '',
        file_type: file.type,
        file_size: file.size,
        file_hash: hash,
        description: description || null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update case status to evidence_uploaded
    await supabaseAdmin
      .from('cases')
      .update({ status: 'evidence_uploaded', updated_at: new Date().toISOString() })
      .eq('id', caseId)
      .eq('status', 'submitted')

    return NextResponse.json({ evidence: data, hash })
  } catch (err) {
    console.error('Evidence upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const caseId = searchParams.get('caseId')
    const userId = searchParams.get('userId')

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    let query = supabaseAdmin.from('evidence').select('*').eq('user_id', userId)
    if (caseId) query = query.eq('case_id', caseId)
    query = query.order('uploaded_at', { ascending: false })

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ evidence: data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
