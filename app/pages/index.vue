<template>
  <div>
    <!-- Lang bar -->
    <div class="fixed top-0 z-[800] right-0  flex p-3 pr-20">
      <button
        v-for="l in ['it','en']" :key="l"
        @click="setLang(l as Lang)"
        :class="['font-mono-ink text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-ink transition-all',
          lang === l ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink hover:text-paper',
          l === 'it' ? 'border-r-0' : '']"
      >{{ l.toUpperCase() }}</button>
    </div>

    <!-- Sticky nav -->
    <nav :class="['sticky top-10 z-[800] border-b flex justify-between items-center px-8 py-3 transition-shadow',
                  scrolled ? 'shadow-sm' : '']"
         style="background:rgba(245,240,232,0.95);backdrop-filter:blur(8px);border-color:var(--paper-border)">
      <span class="font-display text-base font-bold tracking-tight">
        AI<span class="text-red">H</span>M
      </span>
      <div class="hidden md:flex gap-6">
        <a v-for="link in navLinks" :key="link.href" :href="link.href"
           class="font-mono-ink text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-ink"
           style="color:var(--muted)">
          {{ t(link.it, link.en) }}
        </a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-[calc(100vh-48px)] flex flex-col justify-between px-8 md:px-16 pt-20 pb-12 border-b-2 border-ink relative overflow-hidden">
      <div class="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
           style="border: 100px solid rgba(192,57,43,0.05)" />
      <div class="flex flex-col justify-center max-w-4xl">
        <p class="font-mono-ink text-[11px] tracking-[0.2em] uppercase text-red mb-8">
          {{ t('Manifesto Umanista per l\'Intelligenza Artificiale — 2026', 'AI Humanist Manifesto — 2026') }}
        </p>
        <h1 class="font-display font-black leading-[0.92] tracking-tight mb-10"
            style="font-size:clamp(48px,8vw,110px)">
          {{ t('AI al servizio', 'AI in service') }}<br>
          <span class="text-red italic">{{ t("dell'Uomo", 'of Humanity') }}</span>
        </h1>
        <p class="font-display italic max-w-2xl" style="font-size:clamp(16px,2vw,22px);color:var(--muted)">
          {{ t(
            "97 tesi per un'intelligenza artificiale al servizio dell'uomo, dei dati privati e della competenza.",
            "97 theses for an artificial intelligence in service of humanity, private data, and competence."
          ) }}
        </p>
      </div>

      <div class="flex flex-col md:flex-row items-start md:items-end gap-8 pt-12 border-t"
           style="border-color:var(--paper-border)">
        <div class="flex gap-12">
          <div>
            <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-1" style="color:var(--muted)">
              {{ t('Firmatari','Signatories') }}
            </p>
            <p class="font-display text-4xl font-bold text-red leading-none">{{ total }}</p>
          </div>
          <div>
            <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-1" style="color:var(--muted)">Tesi</p>
            <p class="font-display text-4xl font-bold leading-none">97</p>
          </div>
          <div>
            <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mb-1" style="color:var(--muted)">
              {{ t('Anno','Year') }}
            </p>
            <p class="font-display text-4xl font-bold leading-none">2026</p>
          </div>
        </div>
        <div class="flex gap-4 flex-wrap">
          <NuxtLink to="/area-riservata" class="btn-ink">
            ✦ {{ t('Firma il Manifesto','Sign the Manifesto') }}
          </NuxtLink>
          <a href="#manifesto" class="btn-outline">
            {{ t('Leggi le Tesi','Read the Theses') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Manifesto -->
    <section id="manifesto">
      <div class="max-w-5xl mx-auto px-8 md:px-16 py-20">
        <div class="section-label">{{ t('Il Manifesto','The Manifesto') }}</div>
        <div class="divide-y" style="border-color:var(--paper-border)">
          <div v-for="item in tesiByChapter" :key="item.chapter.num"
               class="reveal grid md:grid-cols-[80px_1fr] gap-6 md:gap-8 py-12">
            <div class="font-display text-5xl font-black leading-none select-none pt-1"
                 style="color:var(--paper-border)">
              {{ String(item.chapter.num).padStart(2,'0') }}
            </div>
            <div>
              <h3 class="font-display text-2xl md:text-3xl font-bold mb-6 tracking-tight">
                {{ lang === 'it' ? item.chapter.title_it : item.chapter.title_en }}
              </h3>
              <ul v-if="item.tesi.length" class="space-y-4">
                <li v-for="tesi in item.tesi" :key="tesi.id"
                    class="text-[15px] leading-relaxed pl-5 relative" style="color:#3a352a">
                  <span class="absolute left-0 font-mono-ink" style="color:var(--red)">—</span>
                  {{ lang === 'it' ? tesi.testo_it : tesi.testo_en }}
                </li>
              </ul>
              <p v-else class="font-mono-ink text-[11px] italic" style="color:var(--muted)">
                {{ t('Nessuna tesi approvata ancora.','No approved theses yet.') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Firmatari -->
    <section id="firmatari" class="border-t" style="background:var(--paper-dark);border-color:var(--paper-border)">
      <div class="max-w-5xl mx-auto px-8 md:px-16 py-20">
        <div class="section-label">{{ t('Firmatari','Signatories') }}</div>
        <div class="flex items-baseline gap-4 mb-10">
          <span class="font-display text-5xl font-bold leading-none" style="color:var(--red)">{{ total }}</span>
          <span class="font-mono-ink text-[12px] tracking-[0.15em] uppercase" style="color:var(--muted)">
            {{ t('persone hanno aderito','people have signed') }}
          </span>
        </div>

        <div v-if="!adesioni.length"
             class="border border-dashed p-10 text-center" style="border-color:var(--paper-border)">
          <p class="font-mono-ink text-[12px]" style="color:var(--muted)">
            {{ t('Sii il primo a firmare il manifesto.','Be the first to sign the manifesto.') }}
          </p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
          <div v-for="a in adesioni" :key="a.id"
               class="p-4 transition-colors cursor-default"
               style="background:var(--paper)"
               @mouseenter="(e:MouseEvent) => ((e.currentTarget as HTMLElement).style.background = 'var(--paper-border)')"
               @mouseleave="(e:MouseEvent) => ((e.currentTarget as HTMLElement).style.background = 'var(--paper)')">
            <template v-if="a.anonima || !a.profiles">
              <p class="font-mono-ink text-[12px] italic" style="color:var(--muted)">
                {{ t('Firmatario anonimo','Anonymous') }}
              </p>
            </template>
            <template v-else>
              <p class="font-display text-[15px] font-semibold">
                {{ [a.profiles.nome, a.profiles.cognome].filter(Boolean).join(' ') || t('Firmatario','Signatory') }}
              </p>
              <p v-if="a.profiles.ruolo" class="font-mono-ink text-[10px] mt-0.5" style="color:var(--muted)">
                {{ a.profiles.ruolo }}
              </p>
            </template>
            <p class="font-mono-ink text-[10px] mt-1" style="color:var(--muted)">
              {{ new Date(a.created_at).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB',
                { day:'2-digit', month:'short', year:'numeric' }) }}
            </p>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t flex gap-4 flex-wrap" style="border-color:var(--paper-border)">
          <NuxtLink to="/area-riservata" class="btn-ink">
            ✦ {{ t('Aderisci al Manifesto','Sign the Manifesto') }}
          </NuxtLink>
          <NuxtLink to="/auth/register" class="btn-outline">
            {{ t('Crea un account','Create an account') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t-2 border-ink">
      <div>
        <p class="font-display text-2xl font-bold">
          AI <span style="color:var(--red)">Humanist</span> Manifesto
        </p>
        <p class="font-mono-ink text-[10px] mt-2 tracking-[0.1em]" style="color:var(--muted)">
          {{ t('Progetto open-source — 2026','Open-source project — 2026') }}
        </p>
      </div>
      <div class="flex gap-6">
        <a href="https://github.com" target="_blank"
           class="font-mono-ink text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-ink"
           style="color:var(--muted)">GitHub</a>
        <NuxtLink to="/area-riservata"
           class="font-mono-ink text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-ink"
           style="color:var(--muted)">
          {{ t('Area Riservata','My Account') }}
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Tesi, Adesione, Lang } from '~/types'
import { CHAPTERS } from '~/types'

const { lang, setLang, t } = useLang()
const supabase = useSupabaseClient()
const scrolled = ref(false)

const navLinks = [
  { href: '#manifesto', it: 'Il Manifesto', en: 'The Manifesto' },
  { href: '#firmatari', it: 'Firmatari',    en: 'Signatories' },
  { href: '/area-riservata', it: 'Area Riservata', en: 'My Account' },
]

const tesiByChapter = ref(CHAPTERS.map(ch => ({ chapter: ch, tesi: [] as Tesi[] })))
const adesioni = ref<Adesione[]>([])
const total = ref(0)

const [tesiRes, adesioniRes] = await Promise.all([
  supabase.from('tesi').select('*').order('capitolo').order('numero_tesi'),
  supabase.from('adesioni')
    .select('*, profiles(nome, cognome, ruolo)', { count: 'exact' })
    .is('revocata_at', null)
    .order('created_at', { ascending: false }),
])

tesiByChapter.value = CHAPTERS.map(ch => ({
  chapter: ch,
  tesi: ((tesiRes.data || []) as Tesi[]).filter(t => t.capitolo === ch.num),
}))
adesioni.value = (adesioniRes.data || []) as Adesione[]
total.value = adesioniRes.count || 0

onMounted(() => {
  window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 80 })

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

useHead({ title: 'AI Humanist Manifesto — 97 Tesi' })
</script>