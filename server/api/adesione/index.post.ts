import { serverSupabaseUser } from '#supabase/server'
import { getSupabaseAdmin } from '../../utils/supabase-admin'
import { sendAdesionEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const userId = user.sub as string
  const supabase = getSupabaseAdmin()
  const { anonima } = await readBody(event)

  const { data: existing } = await supabase
    .from('adesioni')
    .select('*')
    .eq('user_id', userId)
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
      .insert([{ user_id: userId, anonima: !!anonima }])
    if (error) throw createError({ statusCode: 500, message: error.message })
  }

  // Invia email di conferma
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome')
      .eq('id', userId)
      .single()
    await sendAdesionEmail(user.email!, profile?.nome || 'Firmatario')
  } catch (e) {
    console.error('Email error:', e)
  }

  return { success: true }
})