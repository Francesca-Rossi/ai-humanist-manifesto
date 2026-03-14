import { serverSupabaseUser } from '#supabase/server'
import { getSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const userId = user.sub as string
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('tesi_proposte')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})