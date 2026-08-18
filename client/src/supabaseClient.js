/**
 * MODO DEMONSTRAÇÃO — sem Supabase real.
 *
 * Este arquivo expõe um objeto com a MESMA forma que o cliente real do
 * Supabase (`supabase.auth.signUp`, `.signInWithPassword`, `.getSession`,
 * `.onAuthStateChange`, `.signOut`), mas por baixo dos panos usa
 * `src/lib/localAuth.js`, que guarda tudo em localStorage. Nenhuma
 * requisição de rede é feita.
 *
 * PARA VOLTAR A USAR O SUPABASE DE VERDADE, troque este arquivo por:
 *
 *   import { createClient } from '@supabase/supabase-js'
 *
 *   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
 *   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
 *
 *   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
 *
 * (é literalmente o que este arquivo tinha antes)
 */

import { localAuth } from './lib/localAuth'

export const supabase = {
  auth: localAuth,
}
