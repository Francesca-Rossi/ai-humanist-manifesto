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
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

onMounted(async () => {
  const code = route.query.code as string

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Callback error:', error)
      await router.push('/auth/login')
      return
    }
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const meta = user.user_metadata
    await supabase.from('profiles').upsert({
      id: user.id,
      nome: meta?.nome || meta?.full_name?.split(' ')[0] || null,
      cognome: meta?.cognome || meta?.full_name?.split(' ').slice(1).join(' ') || null,
      ruolo: meta?.ruolo || null,
    }, { onConflict: 'id', ignoreDuplicates: true })

    const redirect = (route.query.redirect as string) || '/area-riservata'
    await router.push(redirect)
  } else {
    await router.push('/auth/login')
  }
})
</script>