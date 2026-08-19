import { localAuth } from './lib/localAuth'

export const supabase = {
  auth: localAuth,
}
