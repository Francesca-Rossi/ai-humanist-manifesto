<template>
  <div class="space-y-10">

    <!-- Header -->
    <div class="border-b pb-8" style="border-color:var(--paper-border)">
      <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-2" style="color:var(--muted)">
        Pannello Admin
      </p>
      <h1 class="font-display text-4xl font-black tracking-tight">Tesi Proposte</h1>
      <p class="text-sm mt-2" style="color:var(--muted)">
        {{ tesiProposte.length }} proposte totali —
        {{ tesiProposte.filter(t => t.status === 'in_attesa').length }} in attesa
      </p>
    </div>

    <!-- Filtri -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="f in filtri" :key="f.value"
              @click="filtroAttivo = f.value"
              :class="['font-mono-ink text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-all',
                filtroAttivo === f.value
                  ? 'border-ink bg-ink text-paper'
                  : 'border-paper-border hover:border-ink']"
              style="color: inherit">
        {{ f.label }} ({{ conteggio(f.value) }})
      </button>
    </div>

    <!-- Lista -->
    <div v-if="tesiFiltrate.length === 0"
         class="border border-dashed p-10 text-center" style="border-color:var(--paper-border)">
      <p class="font-mono-ink text-[12px]" style="color:var(--muted)">Nessuna proposta in questa categoria.</p>
    </div>

    <div v-else class="divide-y border" style="border-color:var(--paper-border)">
      <div v-for="tp in tesiFiltrate" :key="tp.id"
           class="p-6" style="background:var(--paper)">

        <!-- Meta -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <p class="font-mono-ink text-[10px] tracking-[0.1em] uppercase mb-1" style="color:var(--muted)">
              Cap. {{ tp.capitolo_riferimento }} — {{ chapterName(tp.capitolo_riferimento) }}
            </p>
            <p class="font-mono-ink text-[10px]" style="color:var(--muted)">
              {{ new Date(tp.created_at).toLocaleDateString('it-IT',
                { day:'2-digit', month:'long', year:'numeric' }) }}
            </p>
          </div>
          <UBadge :color="STATUS_CONFIG[tp.status].color" variant="subtle" size="xs">
            {{ STATUS_CONFIG[tp.status].it }}
          </UBadge>
        </div>

        <!-- Tesi -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="border-l-4 pl-4" style="border-color:var(--ink)">
            <p class="font-mono-ink text-[9px] uppercase tracking-widest mb-1" style="color:var(--muted)">IT</p>
            <p class="font-display text-[15px] italic leading-relaxed">{{ tp.testo_it }}</p>
          </div>
          <div class="border-l-4 pl-4" style="border-color:var(--paper-border)">
            <p class="font-mono-ink text-[9px] uppercase tracking-widest mb-1" style="color:var(--muted)">EN</p>
            <p class="font-display text-[15px] italic leading-relaxed" style="color:var(--muted)">{{ tp.testo_en }}</p>
          </div>
        </div>

        <!-- Motivazione utente -->
        <div v-if="tp.motivazione" class="mb-4 p-3" style="background:var(--paper-dark)">
          <p class="font-mono-ink text-[9px] uppercase tracking-widest mb-1" style="color:var(--muted)">
            Motivazione dell'utente
          </p>
          <p class="text-sm" style="color:var(--muted)">{{ tp.motivazione }}</p>
        </div>

        <!-- Azioni -->
<div v-if="tp.status !== 'approvata' && tp.status !== 'rifiutata'" class="space-y-3">
  <div class="flex gap-2 flex-wrap">
    <!-- Solo in attesa -->
    <button v-if="tp.status === 'in_attesa'"
            @click="setStatus(tp.id, 'presa_in_carico')"
            :disabled="loadingId === tp.id"
            class="btn-outline"
            style="font-size:11px;padding:8px 16px">
      📋 Prendi in carico
    </button>

    <!-- Solo presa in carico -->
    <template v-if="tp.status === 'presa_in_carico'">
      <button @click="openApprova(tp)"
              :disabled="loadingId === tp.id"
              class="btn-ink"
              style="font-size:11px;padding:8px 16px;background:#155724;border-color:#155724">
        ✓ Approva
      </button>
      <button @click="openRifiuta(tp)"
              :disabled="loadingId === tp.id"
              class="btn-ink"
              style="font-size:11px;padding:8px 16px;background:var(--red);border-color:var(--red)">
        ✗ Rifiuta
      </button>
    </template>
  </div>
</div>

        <!-- Risposta admin già data -->
        <div v-if="tp.motivazione_risposta" class="mt-3 p-3 border-l-4"
             :style="{ borderColor: tp.status === 'approvata' ? '#28a745' : 'var(--red)',
                       background: tp.status === 'approvata' ? '#f0fff4' : 'rgba(192,57,43,0.05)' }">
          <p class="font-mono-ink text-[9px] uppercase tracking-widest mb-1"
             :style="{ color: tp.status === 'approvata' ? '#155724' : '#721c24' }">
            Nota admin
          </p>
          <p class="text-sm">{{ tp.motivazione_risposta }}</p>
        </div>

      </div>
    </div>

    <!-- Modal Approva -->
<UModal v-model:open="showApprova">
  <template #content>
    <div class="p-8" style="background:#fefdf9">
      <h3 class="font-display text-xl font-bold mb-2" style="color:var(--ink)">Approva tesi</h3>
      <p class="text-sm mb-4" style="color:var(--muted)">
        La tesi sarà aggiunta in fondo al capitolo {{ tesiSelezionata?.capitolo_riferimento }}.
      </p>

      <div class="mb-4">
        <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
          Nota per l'utente (opzionale)
        </label>
        <textarea v-model="approvaForm.nota" class="input-ink" style="min-height:80px"
                  placeholder="Messaggio di congratulazioni o note..." />
      </div>

      <div v-if="modalError" class="border-l-4 p-3 mb-4"
           style="border-color:var(--red);background:rgba(192,57,43,0.05)">
        <p class="font-mono-ink text-[12px]" style="color:var(--red)">{{ modalError }}</p>
      </div>

      <div class="flex gap-3">
        <button @click="confermaApprova" :disabled="loadingId !== null" class="btn-ink"
                style="background:#155724;border-color:#155724">
          ✓ Conferma approvazione
        </button>
        <button @click="showApprova = false" class="btn-outline">Annulla</button>
      </div>
    </div>
  </template>
</UModal>

    <!-- Modal Rifiuta -->
    <UModal v-model:open="showRifiuta">
      <template #content>
        <div class="p-8" style="background:#fefdf9">
          <h3 class="font-display text-xl font-bold mb-2" style="color:var(--ink)">Rifiuta tesi</h3>
          <p class="text-sm mb-4" style="color:var(--muted)">
            Inserisci una motivazione per l'utente.
          </p>

          <div class="mb-4">
            <label class="font-mono-ink text-[10px] uppercase tracking-[0.2em] block mb-2" style="color:var(--muted)">
              Motivazione del rifiuto *
            </label>
            <textarea v-model="rifiutaForm.motivazione" class="input-ink" style="min-height:100px"
                      placeholder="Spiega perché questa tesi non viene accettata..." />
          </div>

          <div v-if="modalError" class="border-l-4 p-3 mb-4" style="border-color:var(--red);background:rgba(192,57,43,0.05)">
            <p class="font-mono-ink text-[12px]" style="color:var(--red)">{{ modalError }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="confermaRifiuta" :disabled="loadingId !== null" class="btn-ink"
                    style="background:var(--red);border-color:var(--red)">
              ✗ Conferma rifiuto
            </button>
            <button @click="showRifiuta = false" class="btn-outline">Annulla</button>
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import type { TesiProposta } from '~/types'
import { CHAPTERS, STATUS_CONFIG } from '~/types'

definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const router = useRouter()

// Verifica che sia admin
const { data: profile } = await useAsyncData('admin-profile', async () => {
  const userId = user.value?.id || (user.value as any)?.sub
  if (!userId) return null
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single()
  return data
})

if (!profile.value?.is_admin) {
  await router.push('/')
}

// Carica tesi proposte
const { data: tesiData, refresh } = await useAsyncData('admin-tesi', async () => {
  const data = await $fetch<TesiProposta[]>('/api/admin/tesi')
  return data || []
})

const tesiProposte = computed(() => tesiData.value || [])

// Filtri
const filtroAttivo = ref('tutti')
const filtri = [
  { value: 'tutti',           label: 'Tutti' },
  { value: 'in_attesa',       label: 'In attesa' },
  { value: 'presa_in_carico', label: 'In revisione' },
  { value: 'approvata',       label: 'Approvate' },
  { value: 'rifiutata',       label: 'Rifiutate' },
]

const tesiFiltrate = computed(() =>
  filtroAttivo.value === 'tutti'
    ? tesiProposte.value
    : tesiProposte.value.filter(t => t.status === filtroAttivo.value)
)

function conteggio(val: string) {
  if (val === 'tutti') return tesiProposte.value.length
  return tesiProposte.value.filter(t => t.status === val).length
}

function chapterName(num: number) {
  return CHAPTERS.find(c => c.num === num)?.title_it || ''
}

// Azioni
const loadingId = ref<string | null>(null)
const modalError = ref('')

// Presa in carico
async function setStatus(id: string, status: string) {
  loadingId.value = id
  try {
    await $fetch('/api/admin/tesi', {
      method: 'PATCH',
      body: { id, status },
    })
    toast.add({ title: 'Stato aggiornato', color: 'green' })
    // Aggiorna manualmente la lista locale senza refetch
    const idx = tesiData.value?.findIndex(t => t.id === id)
    if (idx !== undefined && idx >= 0 && tesiData.value) {
      tesiData.value[idx] = { ...tesiData.value[idx], status: status as any }
    }
  } catch (e: any) {
    toast.add({ title: 'Errore', description: e?.data?.message || 'Errore', color: 'red' })
  }
  loadingId.value = null
}

// Approva
const showApprova = ref(false)
const tesiSelezionata = ref<TesiProposta | null>(null)
const approvaForm = reactive({ numero_tesi: '', nota: '' })

async function openApprova(tp: TesiProposta) {
  tesiSelezionata.value = tp
  approvaForm.numero_tesi = ''
  approvaForm.nota = ''
  modalError.value = ''
  showApprova.value = true
}

async function confermaApprova() {
  if (!tesiSelezionata.value) return

  loadingId.value = tesiSelezionata.value.id
  modalError.value = ''

  try {
    // Calcola automaticamente il prossimo numero
    const { data: esistenti } = await supabase
      .from('tesi')
      .select('numero_tesi')
      .eq('capitolo', tesiSelezionata.value.capitolo_riferimento)
      .order('numero_tesi', { ascending: false })
      .limit(1)

    const ultimoNumero = esistenti?.[0]?.numero_tesi || 0
    const prossimoNumero = ultimoNumero + 1

    await $fetch('/api/admin/tesi', {
      method: 'PATCH',
      body: {
        id: tesiSelezionata.value.id,
        status: 'approvata',
        motivazione_risposta: approvaForm.nota || 'La tua tesi è stata approvata ed è ora parte del manifesto.',
        capitolo: tesiSelezionata.value.capitolo_riferimento,
        numero_tesi: prossimoNumero,
        testo_it: tesiSelezionata.value.testo_it,
        testo_en: tesiSelezionata.value.testo_en,
      },
    })
    toast.add({ title: '✓ Tesi approvata e aggiunta al manifesto!', color: 'green' })
    showApprova.value = false
    await refresh()
  } catch (e: any) {
    modalError.value = e?.data?.message || 'Errore durante l\'approvazione.'
  }
  loadingId.value = null
}

// Rifiuta
const showRifiuta = ref(false)
const rifiutaForm = reactive({ motivazione: '' })

function openRifiuta(tp: TesiProposta) {
  tesiSelezionata.value = tp
  rifiutaForm.motivazione = ''
  modalError.value = ''
  showRifiuta.value = true
}

async function confermaRifiuta() {
  if (!rifiutaForm.motivazione.trim()) {
    modalError.value = 'Inserisci una motivazione per il rifiuto.'
    return
  }
  if (!tesiSelezionata.value) return

  loadingId.value = tesiSelezionata.value.id
  modalError.value = ''

  try {
    await $fetch('/api/admin/tesi', {
      method: 'PATCH',
      body: {
        id: tesiSelezionata.value.id,
        status: 'rifiutata',
        motivazione_risposta: rifiutaForm.motivazione,
      },
    })
    toast.add({ title: 'Tesi rifiutata', color: 'amber' })
    showRifiuta.value = false
    await refresh()
  } catch (e: any) {
    modalError.value = e?.data?.message || 'Errore durante il rifiuto.'
  }
  loadingId.value = null
}

useHead({ title: 'Admin — AI Humanist Manifesto' })
</script>