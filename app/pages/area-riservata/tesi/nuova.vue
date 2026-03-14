<template>
  <div>
    <div class="mb-10">
      <NuxtLink to="/area-riservata"
        class="font-mono-ink text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-ink"
        style="color:var(--muted)">← Torna alla dashboard</NuxtLink>
    </div>

    <div class="border-b pb-8 mb-10" style="border-color:var(--paper-border)">
      <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-2" style="color:var(--muted)">
        Nuova proposta
      </p>
      <h1 class="font-display text-4xl font-black tracking-tight">Proponi una Tesi</h1>
      <p class="text-sm mt-2 max-w-lg" style="color:var(--muted)">
        La tua proposta sarà inviata al team per revisione.
        Riceverai una email ad ogni aggiornamento di stato.
      </p>
    </div>

    <!-- Info box -->
    <div class="border-l-4 p-5 mb-8" style="border-color:var(--red);background:var(--paper-dark)">
      <p class="font-mono-ink text-[10px] uppercase tracking-[0.15em] mb-1 font-medium" style="color:var(--red)">
        Come funziona
      </p>
      <p class="text-sm leading-relaxed" style="color:var(--muted)">
        Scrivi la tesi in <strong style="color:var(--ink)">italiano e inglese</strong>.
        Se approvata, sarà integrata nel capitolo scelto del manifesto.
        Puoi proporre più tesi, anche in capitoli diversi.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Capitolo -->
      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Capitolo di riferimento *
        </label>
        <select v-model="form.capitolo" class="input-ink">
          <option v-for="ch in CHAPTERS" :key="ch.num" :value="String(ch.num)">
            {{ ch.num }}. {{ ch.title_it }}
          </option>
        </select>
      </div>

      <!-- IT -->
      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Tesi in Italiano *
        </label>
        <textarea v-model="form.testo_it" class="input-ink"
                  placeholder="Scrivi la tua tesi in italiano in modo chiaro e conciso..."
                  required />
        <p class="font-mono-ink text-[10px] mt-1" style="color:var(--muted)">
          {{ form.testo_it.length }} caratteri
        </p>
      </div>

      <!-- EN -->
      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Thesis in English *
        </label>
        <textarea v-model="form.testo_en" class="input-ink"
                  placeholder="Write your thesis in English clearly and concisely..."
                  required />
        <p class="font-mono-ink text-[10px] mt-1" style="color:var(--muted)">
          {{ form.testo_en.length }} characters
        </p>
      </div>

      <!-- Motivazione -->
      <div>
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Motivazione <span class="normal-case">(opzionale ma consigliata)</span>
        </label>
        <textarea v-model="form.motivazione" class="input-ink" style="min-height:80px"
                  placeholder="Perché questa tesi è importante per il manifesto?" />
      </div>

      <!-- Preview -->
      <div v-if="form.testo_it || form.testo_en"
           class="border-l-4 p-5" style="border-color:var(--ink);background:var(--paper-dark)">
        <p class="font-mono-ink text-[10px] uppercase tracking-[0.15em] mb-3" style="color:var(--muted)">
          Anteprima
        </p>
        <p v-if="form.testo_it" class="font-display text-[15px] italic mb-2">— {{ form.testo_it }}</p>
        <p v-if="form.testo_en" class="font-display text-[14px] italic" style="color:var(--muted)">
          — {{ form.testo_en }}
        </p>
      </div>

      <div v-if="submitError" class="border-l-4 p-4" style="border-color:var(--red);background:rgba(192,57,43,0.05)">
        <p class="font-mono-ink text-[12px]" style="color:var(--red)">{{ submitError }}</p>
      </div>

      <div class="flex gap-4 pt-4 border-t flex-wrap" style="border-color:var(--paper-border)">
        <button type="submit" :disabled="loading" class="btn-ink">
          {{ loading ? 'Invio in corso...' : '→ Invia per Revisione' }}
        </button>
        <NuxtLink to="/area-riservata" class="btn-outline">Annulla</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CHAPTERS } from '~/types'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const toast = useToast()

const form = reactive({
  capitolo: '1',
  testo_it: '',
  testo_en: '',
  motivazione: '',
})
const loading = ref(false)
const submitError = ref('')

async function handleSubmit() {
  loading.value = true
  submitError.value = ''

  if (form.testo_it.trim().length < 20 || form.testo_en.trim().length < 20) {
    submitError.value = 'Ogni tesi deve essere di almeno 20 caratteri in entrambe le lingue.'
    loading.value = false
    return
  }

  try {
    await $fetch('/api/tesi', {
      method: 'POST',
      body: {
        capitolo: parseInt(form.capitolo),
        testo_it: form.testo_it,
        testo_en: form.testo_en,
        motivazione: form.motivazione,
      },
    })
    toast.add({
      title: '✓ Proposta inviata!',
      description: 'Il team la riceverà e ti aggiornerà via email.',
      color: 'green',
    })
    await router.push('/area-riservata')
  } catch (e: any) {
    submitError.value = e?.data?.message || 'Errore durante l\'invio. Riprova.'
  }
  loading.value = false
}

useHead({ title: 'Proponi una Tesi — AI Humanist Manifesto' })
</script>