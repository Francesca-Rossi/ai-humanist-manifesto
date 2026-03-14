export type ThesisStatus = 'in_attesa' | 'presa_in_carico' | 'approvata' | 'rifiutata'
export type Lang = 'it' | 'en'

export interface Profile {
  id: string
  nome: string | null
  cognome: string | null
  ruolo: string | null
  is_admin: boolean
  created_at: string
}

export interface Tesi {
  id: string
  capitolo: number
  numero_tesi: number
  testo_it: string
  testo_en: string
  approvata_at: string
  created_at: string
}

export interface TesiProposta {
  id: string
  user_id: string
  capitolo_riferimento: number
  testo_it: string
  testo_en: string
  motivazione: string | null
  status: ThesisStatus
  motivazione_risposta: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Adesione {
  id: string
  user_id: string
  anonima: boolean
  created_at: string
  revocata_at: string | null
  profiles?: Profile
}

export interface Chapter {
  num: number
  title_it: string
  title_en: string
}

export const CHAPTERS: Chapter[] = [
  { num: 1, title_it: "L'Uomo Decide, Sempre",              title_en: "Humans Decide, Always" },
  { num: 2, title_it: "I Dati Privati Non Sono Merce",       title_en: "Private Data Is Not a Commodity" },
  { num: 3, title_it: "SLM vs LLM: Il Futuro è Sovrano",    title_en: "SLM vs LLM: The Sovereign Future" },
  { num: 4, title_it: "Spiegabilità e Trasparenza",          title_en: "Explainability and Transparency" },
  { num: 5, title_it: "Meccanismi di Controllo",             title_en: "Control Mechanisms" },
  { num: 6, title_it: "Settori Esclusivamente Umani",        title_en: "Exclusively Human Domains" },
  { num: 7, title_it: "Il Futuro è Ibrido, non Automatico",  title_en: "The Future Is Hybrid, Not Automatic" },
]

export const STATUS_CONFIG: Record<ThesisStatus, {
  it: string; en: string; color: 'warning' | 'info' | 'success' | 'error'
}> = {
  in_attesa:       { it: 'In attesa',      en: 'Pending',      color: 'warning' },
  presa_in_carico: { it: 'In revisione',   en: 'Under review', color: 'info'    },
  approvata:       { it: 'Approvata',      en: 'Approved',     color: 'success' },
  rifiutata:       { it: 'Rifiutata',      en: 'Rejected',     color: 'error'   },
}