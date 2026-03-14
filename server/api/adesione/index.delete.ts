import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const supabase = await serverSupabaseClient(event)

  const { error } = await supabase
    .from('adesioni')
    .update({ revocata_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('revocata_at', null)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})