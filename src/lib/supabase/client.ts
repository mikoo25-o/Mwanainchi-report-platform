import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Check that .env.local exists at your PROJECT ROOT (same folder as package.json), ' +
    'contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, ' +
    'and that you restarted "npm run dev" AFTER saving the file.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)