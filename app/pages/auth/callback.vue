<template>
  <div class="min-h-screen flex items-center justify-center" style="background:var(--paper)">
    <div class="text-center">
      <p class="font-display text-2xl font-bold mb-2">AI<span style="color:var(--red)">H</span>M</p>
      <p class="font-mono-ink text-[11px] uppercase tracking-widest" style="color:var(--muted)">
        Accesso in corso...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()

onMounted(async () => {
  // @nuxtjs/supabase gestisce automaticamente il code exchange
  // Aspettiamo solo che la sessione sia pronta
  let attempts = 0
  const maxAttempts = 10

  const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Upsert profile
      const meta = user.user_metadata
      await (supabase.from('profiles') as any).upsert({
        id: user.id,
        nome: meta?.nome || meta?.full_name?.split(' ')[0] || null,
        cognome: meta?.cognome || meta?.full_name?.split(' ').slice(1).join(' ') || null,
        ruolo: meta?.ruolo || null,
      }, { onConflict: 'id', ignoreDuplicates: true })

      const redirect = (route.query.redirect as string) || '/area-riservata'
      await router.push(redirect)
    } else if (attempts < maxAttempts) {
      attempts++
      setTimeout(checkSession, 500)
    } else {
      await router.push('/auth/login')
    }
  }

  await checkSession()
})
</script>