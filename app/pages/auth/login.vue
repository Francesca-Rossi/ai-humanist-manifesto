<template>
  <div class="p-10">
    <h1 class="font-display text-2xl font-bold mb-1">Accedi</h1>
    <p class="font-mono-ink text-[11px] tracking-[0.1em] uppercase mb-8" style="color:var(--muted)">
      Area riservata
    </p>

    <!-- Google -->
    <button @click="loginGoogle" :disabled="loading"
            class="btn-outline w-full justify-center mb-6 gap-3">
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continua con Google
    </button>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex-1 h-px" style="background:var(--paper-border)" />
      <span class="font-mono-ink text-[10px] uppercase tracking-widest" style="color:var(--muted)">oppure</span>
      <div class="flex-1 h-px" style="background:var(--paper-border)" />
    </div>

    <form @submit.prevent="loginEmail" class="space-y-4">
      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Email
        </label>
        <input v-model="form.email" type="email" placeholder="mario@esempio.com"
               class="input-ink" required />
      </div>
      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Password
        </label>
        <input v-model="form.password" type="password" placeholder="••••••••"
               class="input-ink" required />
      </div>

      <div v-if="error" class="border-l-4 border-red-500 p-3" style="background:rgba(192,57,43,0.05)">
        <p class="font-mono-ink text-[12px]" style="color:var(--red)">{{ error }}</p>
      </div>

      <button type="submit" :disabled="loading" class="btn-ink w-full justify-center">
        {{ loading ? 'Accesso in corso...' : '→ Accedi' }}
      </button>
    </form>

    <p class="font-mono-ink text-[11px] text-center mt-6" style="color:var(--muted)">
      Non hai un account?
      <NuxtLink to="/auth/register" class="underline underline-offset-2" style="color:var(--ink)">
        Registrati
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const redirect = (route.query.redirect as string) || '/area-riservata'

async function loginEmail() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })
  if (err) {
    error.value = err.message.includes('Invalid') ? 'Email o password non corretti.' : err.message
  } else {
    toast.add({ title: 'Accesso effettuato', color: 'green' })
    await router.push(redirect)
  }
  loading.value = false
}

async function loginGoogle() {
  loading.value = true
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
  })
}
</script>