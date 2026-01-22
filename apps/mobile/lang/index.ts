import en from './en.json';
import it from './it.json';
import de from './de.json';
import nl from './nl.json';
import fr from './fr.json';
import es from './es.json';

export const resources = {
  en: { translation: en },
  it: { translation: it },
  de: { translation: de },
  nl: { translation: nl },
  fr: { translation: fr },
  es: { translation: es },
};

export const supportedLanguages = ['en', 'it', 'de', 'nl', 'fr', 'es'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  it: 'Italiano',
  de: 'Deutsch',
  nl: 'Nederlands',
  fr: 'Français',
  es: 'Español',
};
