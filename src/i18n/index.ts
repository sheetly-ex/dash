import { translations, type Language, type TranslationTree } from './translations';

type Paths<T, P extends string = ''> = T extends string
  ? P
  : T extends readonly string[]
    ? P
    : { [K in keyof T]: Paths<T[K], P extends '' ? `${K & string}` : `${P}.${K & string}`> }[keyof T];

export type TranslationKey = Paths<TranslationTree>;

function getNested(obj: Record<string, unknown>, path: string): string | readonly string[] | undefined {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string | readonly string[] | undefined;
}

export function createT(lang: Language) {
  const dict = translations[lang] as unknown as Record<string, unknown>;
  return function t(key: TranslationKey): string {
    const val = getNested(dict, key);
    if (typeof val === 'string') return val;
    return key;
  };
}

export function createTArray(lang: Language) {
  const dict = translations[lang] as unknown as Record<string, unknown>;
  return function tArray(key: TranslationKey): readonly string[] {
    const val = getNested(dict, key);
    if (Array.isArray(val)) return val;
    return [];
  };
}
