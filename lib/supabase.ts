// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabase = createClient()

// Custom login for your Users table
export async function loginWithUsersTable(email: string, password: string) {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('e-mail', email)
    .eq('Password', password)
    .single()
  
  return { data, error }
}

// Type for your custom Users table
export type User = {
  id: number
  'Name Surname': string
  'e-mail': string
  Password: string
  Credits: number | null
  created_at: string
}

