import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const supabase = await serverSupabaseClient(event)
  const { anonima } = await readBody(event)

  // Controlla se esiste già
  const { data: existing } = await supabase
    .from('adesioni')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing && !existing.revocata_at) {
    throw createError({ statusCode: 409, message: 'Hai già aderito al manifesto.' })
  }

  if (existing) {
    const { error } = await supabase
      .from('adesioni')
      .update({ revocata_at: null, anonima: !!anonima, created_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) throw createError({ statusCode: 500, message: error.message })
  } else {
    const { error } = await supabase
      .from('adesioni')
      .insert([{ user_id: user.id, anonima: !!anonima }])
    if (error) throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})