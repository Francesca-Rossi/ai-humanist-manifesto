<template>
  <div class="p-10">
    <h1 class="font-display text-2xl font-bold mb-1">Crea un account</h1>
    <p class="font-mono-ink text-[11px] tracking-[0.1em] uppercase mb-8" style="color:var(--muted)">
      Per aderire e proporre tesi
    </p>

    <!-- Google -->
    <button @click="registerGoogle" :disabled="loading"
            class="btn-outline w-full justify-center mb-6 gap-3">
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Registrati con Google
    </button>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex-1 h-px" style="background:var(--paper-border)" />
      <span class="font-mono-ink text-[10px] uppercase tracking-widest" style="color:var(--muted)">oppure</span>
      <div class="flex-1 h-px" style="background:var(--paper-border)" />
    </div>

    <!-- Success -->
    <div v-if="success" class="text-center py-8">
      <p class="font-display text-5xl mb-4">✓</p>
      <h2 class="font-display text-2xl font-bold mb-2">Controlla la tua email</h2>
      <p class="text-sm leading-relaxed" style="color:var(--muted)">
        Abbiamo inviato un link di conferma a <strong>{{ form.email }}</strong>.<br>
        Clicca il link per attivare il tuo account.
      </p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
            Nome
          </label>
          <input v-model="form.nome" type="text" placeholder="Mario" class="input-ink" />
        </div>
        <div>
          <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
            Cognome
          </label>
          <input v-model="form.cognome" type="text" placeholder="Rossi" class="input-ink" />
        </div>
      </div>

      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Ruolo / Organizzazione <span class="normal-case">(opzionale)</span>
        </label>
        <input v-model="form.ruolo" type="text" placeholder="CTO, Startup XYZ" class="input-ink" />
      </div>

      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Email *
        </label>
        <input v-model="form.email" type="email" placeholder="mario@esempio.com"
               class="input-ink" required />
      </div>

      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Password *
        </label>
        <input v-model="form.password" type="password" placeholder="Minimo 8 caratteri"
               class="input-ink" required />
      </div>

      <div v-if="error" class="border-l-4 border-red-500 p-3" style="background:rgba(192,57,43,0.05)">
        <p class="font-mono-ink text-[12px]" style="color:var(--red)">{{ error }}</p>
      </div>

      <button type="submit" :disabled="loading" class="btn-ink w-full justify-center">
        {{ loading ? 'Registrazione...' : '→ Crea Account' }}
      </button>
    </form>

    <p class="font-mono-ink text-[11px] text-center mt-6" style="color:var(--muted)">
      Hai già un account?
      <NuxtLink to="/auth/login" class="underline underline-offset-2" style="color:var(--ink)">
        Accedi
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const supabase = useSupabaseClient()
const toast = useToast()

const form = reactive({ nome: '', cognome: '', ruolo: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  loading.value = true
  error.value = ''

  if (form.password.length < 8) {
    error.value = 'La password deve essere di almeno 8 caratteri.'
    loading.value = false
    return
  }

  const { data, error: err } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: { nome: form.nome, cognome: form.cognome, ruolo: form.ruolo },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (err) {
    error.value = err.message
    loading.value = false
    return
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      nome: form.nome || null,
      cognome: form.cognome || null,
      ruolo: form.ruolo || null,
    }, { onConflict: 'id', ignoreDuplicates: true })
  }

  success.value = true
  loading.value = false
}

async function registerGoogle() {
  loading.value = true
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}
</script>