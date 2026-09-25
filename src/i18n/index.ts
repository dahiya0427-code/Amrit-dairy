import { en } from './en'
import { hi } from './hi'
import type { Locale } from './config'

const dictionaries = { en, hi }

export const getDictionary = (locale: Locale) => dictionaries[locale] ?? en
export type { Dictionary } from './en'
