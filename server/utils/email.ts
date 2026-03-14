import { Resend } from 'resend'

export function getResend() {
  const config = useRuntimeConfig()
  return new Resend(config.resendApiKey)
}

const emailBase = (content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:Georgia,serif;background:#f5f0e8;margin:0;padding:0}
  .wrap{max-width:560px;margin:40px auto;background:#fefdf9;border:1px solid #d4cfc4}
  .hdr{background:#0f0e0b;color:#f5f0e8;padding:32px 40px}
  .hdr h1{margin:0;font-size:20px;letter-spacing:-0.01em}
  .hdr p{margin:8px 0 0;font-family:monospace;font-size:11px;letter-spacing:.15em;color:#8a8070;text-transform:uppercase}
  .body{padding:40px}
  .body p{color:#3a352a;line-height:1.7;margin:0 0 16px}
  .quote{background:#f5f0e8;border-left:4px solid #c0392b;padding:20px 24px;margin:24px 0;font-style:italic;color:#0f0e0b}
  .btn{display:inline-block;background:#0f0e0b;color:#f5f0e8!important;padding:14px 28px;text-decoration:none;font-family:monospace;font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-top:8px}
  .foot{padding:24px 40px;border-top:1px solid #d4cfc4;font-family:monospace;font-size:10px;color:#8a8070;letter-spacing:.1em}
  .g{background:#d4edda;color:#155724} .r{background:#f8d7da;color:#721c24} .b{background:#d1ecf1;color:#0c5460}
  .badge{display:inline-block;padding:4px 12px;font-family:monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
</style></head><body>
<div class="wrap">
  <div class="hdr">
    <p>AI Humanist Manifesto</p>
    <h1>97 Tesi per un'AI al servizio dell'Uomo</h1>
  </div>
  <div class="body">${content}</div>
  <div class="foot">AI Humanist Manifesto — Progetto open-source 2026</div>
</div></body></html>`

export async function sendAdesionEmail(to: string, nome: string) {
  const config = useRuntimeConfig()
  const resend = getResend()
  return resend.emails.send({
    from: config.resendFromEmail as string,
    to,
    subject: "✦ Hai firmato l'AI Humanist Manifesto",
    html: emailBase(`
      <p>Ciao <strong>${nome}</strong>,</p>
      <p>La tua adesione è registrata. Grazie per sostenere un'AI al servizio dell'uomo.</p>
      <div class="quote">"L'AI non decide. Propone, analizza, accelera,<br>ma l'ultima parola spetta all'uomo."</div>
      <a href="${config.public.appUrl}/area-riservata" class="btn">→ La tua area riservata</a>
    `),
  })
}

export async function sendThesisStatusEmail(
  to: string,
  nome: string,
  tesiTesto: string,
  status: string,
  motivazione?: string | null,
) {
  const config = useRuntimeConfig()
  const resend = getResend()

  const msgs: Record<string, { subject: string; body: string; badge: string; cls: string }> = {
    presa_in_carico: {
      subject: '📋 La tua tesi è in revisione',
      body: 'Il team ha preso in carico la tua proposta. Ti aggiorneremo presto.',
      badge: 'In revisione', cls: 'b'
    },
    approvata: {
      subject: '✓ La tua tesi è stata approvata!',
      body: 'Congratulazioni! La tua tesi è ora parte del manifesto.',
      badge: 'Approvata', cls: 'g'
    },
    rifiutata: {
      subject: 'Aggiornamento sulla tua proposta',
      body: 'Dopo attenta valutazione, il team ha deciso di non integrare questa tesi in questa fase.',
      badge: 'Non accettata', cls: 'r'
    },
  }

  const m = msgs[status]
  if (!m) return

  return resend.emails.send({
    from: config.resendFromEmail as string,
    to,
    subject: m.subject,
    html: emailBase(`
      <p>Ciao <strong>${nome}</strong>,</p>
      <p>${m.body}</p>
      <p>Stato: <span class="badge ${m.cls}">${m.badge}</span></p>
      <div class="quote">${tesiTesto}</div>
      ${motivazione ? `<p><strong>Nota del team:</strong><br>${motivazione}</p>` : ''}
      <a href="${config.public.appUrl}/area-riservata" class="btn">→ Le tue proposte</a>
    `),
  })
}

export async function sendAdminNewThesisEmail(
  authorName: string,
  authorEmail: string,
  capitolo: number,
  tesiIt: string,
  tesiEn: string,
  motivazione?: string | null,
) {
  const config = useRuntimeConfig()
  const resend = getResend()
  return resend.emails.send({
    from: config.resendFromEmail as string,
    to: config.adminEmail as string,
    subject: `[Manifesto] Nuova tesi proposta — Capitolo ${capitolo}`,
    html: emailBase(`
      <p><strong>Nuova proposta ricevuta</strong></p>
      <p>Da: ${authorName} (${authorEmail})<br>Capitolo: ${capitolo}</p>
      <p><strong>IT:</strong></p><div class="quote">${tesiIt}</div>
      <p><strong>EN:</strong></p><div class="quote">${tesiEn}</div>
      ${motivazione ? `<p><strong>Motivazione:</strong><br>${motivazione}</p>` : ''}
      <a href="${config.public.appUrl}/admin" class="btn">→ Pannello Admin</a>
    `),
  })
}