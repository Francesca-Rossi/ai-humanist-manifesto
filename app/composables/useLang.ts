import type { Lang } from '~/types'

export function useLang() {
  const lang = useState<Lang>('lang', () => 'it')

  function setLang(l: Lang) { lang.value = l }

  function t(it: string, en: string): string {
    return lang.value === 'it' ? it : en
  }

  return { lang, setLang, t }
}