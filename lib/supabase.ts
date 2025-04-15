import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Crear un cliente para el lado del servidor
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Crear un cliente para el lado del cliente (singleton)
let clientSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  clientSupabaseClient = createClient<Database>(supabaseUrl, supabaseKey)

  return clientSupabaseClient
}
