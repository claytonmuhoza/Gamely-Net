import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEN from './locales/en.json'
import translationFR from './locales/fr.json'

const resources = {
    en: {
        translation: translationEN
    },
    fr: {
        translation: translationFR
    }
}

i18n
    // Détecte la langue du navigateur
    .use(LanguageDetector)
    // Passe l'instance i18n à react-i18next
    .use(initReactI18next)
    // Initialise i18next
    .init({
        resources,
        fallbackLng: 'fr', // Langue par défaut
        debug: false,

        interpolation: {
            escapeValue: false // React échappe déjà les valeurs
        },

        detection: {
            // Ordre de détection
            order: ['localStorage', 'navigator', 'htmlTag'],
            // Clé pour stocker la langue dans localStorage
            lookupLocalStorage: 'i18nextLng',
            // Cache la langue détectée
            caches: ['localStorage'],
        }
    })

export default i18n