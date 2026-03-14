<template>
  <div class="space-y-12">

    <!-- Greeting -->
    <div class="border-b pb-8" style="border-color:var(--paper-border)">
      <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-2" style="color:var(--muted)">
        Area Riservata
      </p>
      <h1 class="font-display text-4xl font-black tracking-tight">
        Ciao, <span class="italic" style="color:var(--red)">{{ nome }}</span>
      </h1>
    </div>

    <!-- Adesione -->
    <section class="border" style="border-color:var(--paper-border)">
      <div class="px-6 py-4 border-b flex items-center justify-between"
           style="background:var(--paper-dark);border-color:var(--paper-border)">
        <div>
          <p class="font-mono-ink text-[10px] uppercase tracking-[0.2em] mb-0.5" style="color:var(--muted)">
            Il Manifesto
          </p>
          <h2 class="font-display text-xl font-bold">La tua adesione</h2>
        </div>
        <div class="flex items-center gap-2">
          <span :class="['w-2 h-2 rounded-full', isActive ? 'bg-green-500' : 'bg-stone-400']" />
          <span class="font-mono-ink text-[11px] uppercase tracking-[0.1em]"
                :style="{ color: isActive ? '#155724' : 'var(--muted)' }">
            {{ isActive ? 'Attiva' : 'Non firmato' }}
          </span>
        </div>
      </div>

      <div class="p-6">
        <!-- Firmato -->
        <template v-if="isActive && adesione">
          <p class="text-sm leading-relaxed mb-4" style="color:var(--muted)">
            Hai aderito il
            <strong>{{ new Date(adesione.created_at).toLocaleDateString('it-IT',
              { day:'2-digit', month:'long', year:'numeric' }) }}</strong>.
            {{ adesione.anonima ? 'La tua adesione è anonima.' : 'Il tuo nome è visibile nella lista dei firmatari.' }}
          </p>
          <div class="flex gap-3 flex-wrap">
            <a href="/#firmatari" class="btn-outline">→ Vedi la lista firmatari</a>
            <button @click="confirmRevoke = true" class="btn-outline danger">
              Revoca adesione
            </button>
          </div>
        </template>

        <!-- Non firmato -->
        <template v-else>
          <p class="text-sm leading-relaxed max-w-lg mb-5" style="color:var(--muted)">
            Firmando dichiari di condividere i valori di questo manifesto: l'AI deve essere
            uno strumento al servizio dell'uomo, non il contrario.
          </p>
          <label class="flex items-start gap-3 cursor-pointer group mb-5">
            <input type="checkbox" v-model="anonymous"
                   class="mt-0.5 w-4 h-4 cursor-pointer" style="accent-color:var(--red)" />
            <span class="text-sm transition-colors" style="color:var(--muted)">
              Voglio restare anonimo — il mio nome non sarà mostrato nella lista dei firmatari
            </span>
          </label>
          <button @click="handleSign" :disabled="signingLoading" class="btn-ink">
            {{ signingLoading ? 'Firma in corso...' : '✦ Firma il Manifesto' }}
          </button>
        </template>

        <div v-if="signError" class="mt-4 border-l-4 p-3" style="border-color:var(--red);background:rgba(192,57,43,0.05)">
          <p class="font-mono-ink text-[12px]" style="color:var(--red)">{{ signError }}</p>
        </div>
      </div>
    </section>

    <!-- Revoca modal -->
    <UModal v-model="confirmRevoke">
      <div class="p-8">
        <h3 class="font-display text-xl font-bold mb-2">Revocare l'adesione?</h3>
        <p class="text-sm mb-6" style="color:var(--muted)">
          Puoi sempre ri-aderire in seguito. La tua adesione sarà rimossa dalla lista dei firmatari.
        </p>
        <div class="flex gap-3">
          <button @click="handleRevoke" :disabled="signingLoading" class="btn-ink"
                  style="background:var(--red);border-color:var(--red)">
            {{ signingLoading ? 'Revoca...' : 'Sì, revoca' }}
          </button>
          <button @click="confirmRevoke = false" class="btn-outline">Annulla</button>
        </div>
      </div>
    </UModal>

    <!-- Tesi proposte -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-1" style="color:var(--muted)">
            Le mie proposte
          </p>
          <h2 class="font-display text-2xl font-bold">Tesi proposte</h2>
        </div>
        <NuxtLink to="/area-riservata/tesi/nuova" class="btn-ink">+ Nuova proposta</NuxtLink>
      </div>

      <!-- Empty -->
      <div v-if="!tesiProposte.length"
           class="border border-dashed p-10 text-center" style="border-color:var(--paper-border)">
        <p class="font-mono-ink text-[12px] mb-4" style="color:var(--muted)">
          Non hai ancora proposto nessuna tesi.
        </p>
        <NuxtLink to="/area-riservata/tesi/nuova" class="btn-outline">
          → Proponi la tua prima tesi
        </NuxtLink>
      </div>

      <!-- Lista -->
      <div v-else class="divide-y border" style="border-color:var(--paper-border)">
        <NuxtLink v-for="tp in tesiProposte" :key="tp.id"
                  :to="`/area-riservata/tesi/${tp.id}`"
                  class="flex items-start justify-between gap-4 p-6 transition-colors group block"
                  style="background:var(--paper)"
                  @mouseenter="(e:MouseEvent) => ((e.currentTarget as HTMLElement).style.background = 'var(--paper-dark)')"
                  @mouseleave="(e:MouseEvent) => ((e.currentTarget as HTMLElement).style.background = 'var(--paper)')">
          <div class="flex-1 min-w-0">
            <p class="font-mono-ink text-[10px] tracking-[0.1em] uppercase mb-2" style="color:var(--muted)">
              Cap. {{ tp.capitolo_riferimento }} — {{ chapterName(tp.capitolo_riferimento) }}
            </p>
            <p class="font-display text-[15px] leading-snug line-clamp-2">{{ tp.testo_it }}</p>
            <p class="font-mono-ink text-[10px] mt-2" style="color:var(--muted)">
              {{ new Date(tp.created_at).toLocaleDateString('it-IT',
                { day:'2-digit', month:'long', year:'numeric' }) }}
            </p>
            <div v-if="tp.motivazione_risposta && tp.status === 'rifiutata'"
                 class="mt-3 pt-3 border-t" style="border-color:var(--paper-border)">
              <p class="font-mono-ink text-[11px]" style="color:var(--muted)">
                <span style="color:var(--red)" class="uppercase tracking-widest text-[9px]">Motivazione: </span>
                {{ tp.motivazione_risposta }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <UBadge :color="STATUS_CONFIG[tp.status].color" variant="subtle" size="xs">
              {{ STATUS_CONFIG[tp.status].it }}
            </UBadge>
            <span class="font-mono-ink text-[10px] transition-colors" style="color:var(--muted)">→</span>
          </div>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { TesiProposta, Adesione } from '~/types'
import { CHAPTERS, STATUS_CONFIG } from '~/types'

definePageMeta({ layout: 'dashboard' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const [profileRes, adesioneRes, tesiRes] = await Promise.all([
  supabase.from('profiles').select('nome').eq('id', user.value!.id).single(),
  supabase.from('adesioni').select('*').eq('user_id', user.value!.id).maybeSingle(),
  supabase.from('tesi_proposte').select('*').eq('user_id', user.value!.id).order('created_at', { ascending: false }),
])

const nome = computed(() => profileRes.data?.nome || user.value?.email?.split('@')[0] || 'Utente')
const adesione = ref<Adesione | null>(adesioneRes.data as Adesione | null)
const isActive = computed(() => !!adesione.value && !adesione.value.revocata_at)
const tesiProposte = ref<TesiProposta[]>((tesiRes.data || []) as TesiProposta[])

const anonymous = ref(false)
const signingLoading = ref(false)
const signError = ref('')
const confirmRevoke = ref(false)

function chapterName(num: number) {
  return CHAPTERS.find(c => c.num === num)?.title_it || ''
}

async function handleSign() {
  signingLoading.value = true
  signError.value = ''
  try {
    await $fetch('/api/adesione', { method: 'POST', body: { anonima: anonymous.value } })
    toast.add({ title: '✦ Manifesto firmato!', description: 'Grazie per aver aderito.', color: 'green' })
    const { data } = await supabase.from('adesioni').select('*').eq('user_id', user.value!.id).single()
    adesione.value = data as Adesione
  } catch (e: any) {
    signError.value = e?.data?.message || 'Errore durante la firma.'
  }
  signingLoading.value = false
}

async function handleRevoke() {
  signingLoading.value = true
  try {
    await $fetch('/api/adesione', { method: 'DELETE' })
    toast.add({ title: 'Adesione revocata' })
    confirmRevoke.value = false
    const { data } = await supabase.from('adesioni').select('*').eq('user_id', user.value!.id).single()
    adesione.value = data as Adesione
  } catch (e: any) {
    signError.value = e?.data?.message || 'Errore durante la revoca.'
  }
  signingLoading.value = false
}

useHead({ title: 'Dashboard — AI Humanist Manifesto' })
</script>