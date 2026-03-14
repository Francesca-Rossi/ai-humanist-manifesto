export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Verifica secret
  const secret = getHeader(event, 'x-webhook-secret')
  if (config.webhookSecret && secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const record = body.record
  const oldRecord = body.old_record

  // Salta se lo status non è cambiato
  if (!record || record.status === oldRecord?.status) {
    return { skipped: true }
  }

  // Per ora solo log — aggiungeremo Resend dopo aver configurato il dominio
  console.log(`Tesi ${record.id}: status cambiato da ${oldRecord?.status} a ${record.status}`)

  return { success: true }
})