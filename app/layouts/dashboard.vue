<template>
  <div class="min-h-screen" style="background:var(--paper)">
    <header class="sticky top-0 z-[800] border-b"
            style="background:rgba(245,240,232,0.96);backdrop-filter:blur(8px);border-color:var(--paper-border)">
      <div class="max-w-4xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="font-display text-base font-bold tracking-tight">
            AI<span class="text-red">H</span>M
          </NuxtLink>
          <span class="hidden md:block" style="color:var(--paper-border)">|</span>
          <NuxtLink to="/area-riservata"
            class="hidden md:block font-mono-ink text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-ink"
            style="color:var(--muted)">Dashboard</NuxtLink>
          <NuxtLink to="/area-riservata/tesi/nuova"
            class="hidden md:block font-mono-ink text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-ink"
            style="color:var(--muted)">+ Nuova tesi</NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <span class="hidden sm:block font-mono-ink text-[11px]" style="color:var(--muted)">
            {{ displayName }}
          </span>
          <button @click="logout"
            class="font-mono-ink text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors hover:border-red hover:text-red"
            style="border-color:var(--paper-border);color:var(--muted)">
            Esci
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const toast = useToast()

const { data: profile } = await useAsyncData('profile', async () => {
  if (!user.value) return null
  const userId = user.value?.id || (user.value as any)?.sub
  const { data } = await supabase.from('profiles').select('nome, cognome').eq('id', userId).single()
  return data as { nome: string | null, cognome: string | null } | null
})

const displayName = computed(() => {
  if (profile.value?.nome) return profile.value.nome
  return user.value?.email?.split('@')[0] || 'Utente'
})

async function logout() {
  await supabase.auth.signOut()
  toast.add({ title: 'Uscita effettuata' })
  await router.push('/')
}
</script>