import { serverSupabaseUser } from '#supabase/server'
import { getSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const userId = user.sub as string

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('adesioni')
    .update({ revocata_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('revocata_at', null)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})