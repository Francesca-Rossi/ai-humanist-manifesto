import { serverSupabaseUser } from '#supabase/server'
import { getSupabaseAdmin } from '../../utils/supabase-admin'
import { sendAdminNewThesisEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const userId = user.sub as string

  const { capitolo, testo_it, testo_en, motivazione } = await readBody(event)

  if (!testo_it?.trim() || !testo_en?.trim()) {
    throw createError({ statusCode: 400, message: 'Testo mancante in una o entrambe le lingue.' })
  }

  if (testo_it.trim().length < 20 || testo_en.trim().length < 20) {
    throw createError({ statusCode: 400, message: 'Testo troppo breve (min 20 caratteri per lingua).' })
  }

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('tesi_proposte')
    .insert([{
      user_id: userId,
      capitolo_riferimento: parseInt(capitolo),
      testo_it: testo_it.trim(),
      testo_en: testo_en.trim(),
      motivazione: motivazione?.trim() || null,
      status: 'in_attesa',
    }])
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Notifica admin
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, cognome')
      .eq('id', userId)
      .single()
    const nome = [profile?.nome, profile?.cognome].filter(Boolean).join(' ') || 'Anonimo'
    await sendAdminNewThesisEmail(nome, user.email!, parseInt(capitolo), testo_it, testo_en, motivazione)
  } catch (e) {
    console.error('Email error:', e)
  }

  return data
})