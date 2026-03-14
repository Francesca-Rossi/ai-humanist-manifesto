import { serverSupabaseUser } from '#supabase/server'
import { getSupabaseAdmin } from '../../utils/supabase-admin'
import { sendThesisStatusEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non autenticato' })

  const userId = user.sub as string
  const supabase = getSupabaseAdmin()

  // Verifica admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (!profile?.is_admin) {
    throw createError({ statusCode: 403, message: 'Non autorizzato' })
  }

  const { id, status, motivazione_risposta, capitolo, numero_tesi, testo_it, testo_en } = await readBody(event)

  if (!id || !status) {
    throw createError({ statusCode: 400, message: 'Dati mancanti' })
  }

  // Aggiorna status proposta
  const { error } = await supabase
    .from('tesi_proposte')
    .update({
      status,
      motivazione_risposta: motivazione_risposta || null,
    })
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Se approvata inserisci nella tabella tesi
  if (status === 'approvata' && capitolo && numero_tesi && testo_it && testo_en) {
    const { error: insertError } = await supabase
      .from('tesi')
      .insert([{ capitolo, numero_tesi, testo_it, testo_en }])
    if (insertError) throw createError({ statusCode: 500, message: insertError.message })
  }

  // Invia email all'utente
  try {
  const { data: tesi } = await supabase
    .from('tesi_proposte')
    .select('user_id, testo_it')
    .eq('id', id)
    .single()

  console.log('Tesi trovata:', tesi)

  if (tesi) {
    const { data: userData } = await supabase.auth.admin.getUserById(tesi.user_id)
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('nome')
      .eq('id', tesi.user_id)
      .single()

    console.log('User email:', userData?.user?.email)
    console.log('User profile:', userProfile)

    if (userData?.user?.email) {
      const emailResult = await sendThesisStatusEmail(
        userData.user.email,
        userProfile?.nome || 'Firmatario',
        tesi.testo_it,
        status,
        motivazione_risposta,
      )
      console.log('Email result:', emailResult)
    }
  }
} catch (e) {
  console.error('Email error:', e)
}

  return { success: true }
})