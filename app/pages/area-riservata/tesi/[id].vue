<template>
  <div>
    <div class="mb-10">
      <NuxtLink to="/area-riservata"
        class="font-mono-ink text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-ink"
        style="color:var(--muted)">← Torna alla dashboard</NuxtLink>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-20">
      <p class="font-mono-ink text-[11px] uppercase tracking-widest" style="color:var(--muted)">
        Caricamento...
      </p>
    </div>

    <template v-else-if="tesi">
      <!-- Header -->
      <div class="border-b pb-8 mb-10 flex items-start justify-between gap-4"
           style="border-color:var(--paper-border)">
        <div>
          <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-2" style="color:var(--muted)">
            Cap. {{ tesi.capitolo_riferimento }}{{ chapterTitle ? ` — ${chapterTitle}` : '' }}
          </p>
          <h1 class="font-display text-3xl font-black tracking-tight">Dettaglio proposta</h1>
          <p class="font-mono-ink text-[10px] mt-2" style="color:var(--muted)">
            Inviata il {{ new Date(tesi.created_at).toLocaleDateString('it-IT',
              { day:'2-digit', month:'long', year:'numeric' }) }}
          </p>
        </div>
        <UBadge :color="statusInfo.color" variant="subtle" size="xs">
          {{ statusInfo.it }}
        </UBadge>
      </div>

      <!-- Timeline -->
      <div class="flex items-start gap-0 mb-10 overflow-x-auto pb-2">
        <template v-for="(step, i) in timeline" :key="step.key">
          <div class="flex flex-col items-center min-w-[90px]">
            <div :class="[
              'w-6 h-6 border-2 flex items-center justify-center text-[9px] font-bold transition-all',
              step.done
                ? (tesi.status === 'rifiutata' && i === 2
                    ? 'border-red-500 text-white'
                    : 'text-white border-ink')
                : 'border-paper-border bg-paper'
            ]"
            :style="step.done ? (tesi.status === 'rifiutata' && i === 2
              ? 'background:var(--red)'
              : 'background:var(--ink)') : ''">
              {{ step.done ? '✓' : i + 1 }}
            </div>
            <p class="font-mono-ink text-[9px] mt-1.5 tracking-[0.05em] text-center whitespace-nowrap px-1"
               :style="{ color: step.done ? 'var(--ink)' : 'var(--muted)' }">
              {{ step.label }}
            </p>
          </div>
          <div v-if="i < timeline.length - 1"
               class="h-px w-16 mt-3 shrink-0 transition-all"
               :style="{ background: step.done ? 'var(--ink)' : 'var(--paper-border)' }" />
        </template>
      </div>

      <!-- Contenuto -->
      <div class="space-y-4">
        <!-- IT -->
        <div class="border" style="border-color:var(--paper-border)">
          <div class="px-4 py-2 border-b flex items-center justify-between"
               style="background:var(--paper-dark);border-color:var(--paper-border)">
            <span class="font-mono-ink text-[10px] uppercase tracking-[0.15em]" style="color:var(--muted)">
              Versione Italiana
            </span>
          </div>
          <div class="p-6">
            <p class="font-display text-[17px] leading-relaxed italic">{{ tesi.testo_it }}</p>
          </div>
        </div>

        <!-- EN -->
        <div class="border" style="border-color:var(--paper-border)">
          <div class="px-4 py-2 border-b flex items-center justify-between"
               style="background:var(--paper-dark);border-color:var(--paper-border)">
            <span class="font-mono-ink text-[10px] uppercase tracking-[0.15em]" style="color:var(--muted)">
              English Version
            </span>
          </div>
          <div class="p-6">
            <p class="font-display text-[17px] leading-relaxed italic">{{ tesi.testo_en }}</p>
          </div>
        </div>

        <!-- Motivazione -->
        <div v-if="tesi.motivazione" class="border" style="border-color:var(--paper-border)">
          <div class="px-4 py-2 border-b" style="background:var(--paper-dark);border-color:var(--paper-border)">
            <span class="font-mono-ink text-[10px] uppercase tracking-[0.15em]" style="color:var(--muted)">
              La tua motivazione
            </span>
          </div>
          <div class="p-6">
            <p class="text-[15px] leading-relaxed" style="color:var(--muted)">{{ tesi.motivazione }}</p>
          </div>
        </div>

        <!-- Risposta admin -->
        <div v-if="tesi.motivazione_risposta"
             class="border-l-4 p-5"
             :style="{
               borderColor: tesi.status === 'approvata' ? '#28a745' : 'var(--red)',
               background: tesi.status === 'approvata' ? '#f0fff4' : 'rgba(192,57,43,0.05)'
             }">
          <p class="font-mono-ink text-[10px] uppercase tracking-[0.15em] mb-2 font-medium"
             :style="{ color: tesi.status === 'approvata' ? '#155724' : '#721c24' }">
            {{ tesi.status === 'approvata' ? '✓ Nota del team' : 'Motivazione del rifiuto' }}
          </p>
          <p class="text-sm leading-relaxed">{{ tesi.motivazione_risposta }}</p>
        </div>

        <!-- Approvata -->
        <div v-if="tesi.status === 'approvata'"
             class="border p-6 text-center" style="background:var(--paper-dark);border-color:var(--paper-border)">
          <p class="font-mono-ink text-[11px] mb-3" style="color:var(--muted)">
            Questa tesi è ora parte del manifesto.
          </p>
          <a href="/#manifesto" class="btn-outline">→ Vedi nel manifesto</a>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="font-mono-ink text-[12px]" style="color:var(--muted)">Proposta non trovata.</p>
      <NuxtLink to="/area-riservata" class="btn-outline mt-4 inline-block">← Dashboard</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TesiProposta } from '~/types'
import { CHAPTERS, STATUS_CONFIG } from '~/types'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: tesi, pending } = await useAsyncData(`tesi-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('tesi_proposte')
    .select('*')
    .eq('id', route.params.id)
    .eq('user_id', user.value!.id)
    .single()
  return data as TesiProposta | null
})

const statusInfo = computed(() =>
  tesi.value ? STATUS_CONFIG[tesi.value.status] : STATUS_CONFIG['in_attesa']
)

const chapterTitle = computed(() =>
  tesi.value ? CHAPTERS.find(c => c.num === tesi.value!.capitolo_riferimento)?.title_it : ''
)

const timeline = computed(() => {
  const s = tesi.value?.status
  return [
    { key: 'in_attesa',       label: 'Ricevuta',     done: true },
    { key: 'presa_in_carico', label: 'In revisione', done: ['presa_in_carico','approvata','rifiutata'].includes(s || '') },
    { key: 'finale',          label: s === 'rifiutata' ? 'Non accettata' : 'Approvata', done: ['approvata','rifiutata'].includes(s || '') },
  ]
})

useHead({ title: 'Dettaglio proposta — AI Humanist Manifesto' })
</script>