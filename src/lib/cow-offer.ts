/**
 * Shared rules for the "Sell your cow" form (browser + server), so the limits
 * the form shows are exactly the limits the server enforces.
 */

/** Files are sent in pieces this size; Vercel rejects request bodies over 4.5 MB. */
export const CHUNK_BYTES = 3 * 1024 * 1024
export const MAX_PHOTOS = 8
export const MAX_VIDEOS = 2
/** Photos are resized in the browser first, so this is only a safety net. */
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024
export const MAX_VIDEO_BYTES = 40 * 1024 * 1024

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/3gpp', 'video/x-m4v']

export const MILKING_STATUS = ['milking', 'dry', 'heifer'] as const
export const YES_NO_UNKNOWN = ['yes', 'no', 'unknown'] as const
export const CALF = ['none', 'female', 'male'] as const
export const VACCINES = ['fmd', 'hs', 'bq', 'lsd', 'brucellosis', 'theileria'] as const
export const TRANSPORT = ['seller', 'buyer', 'discuss'] as const

/** Human labels used in the admin and the staff email (the site uses the translated ones). */
export const LABELS = {
  milkingStatus: { milking: 'Giving milk', dry: 'Dry (not milking now)', heifer: 'Heifer (not calved yet)' },
  yesNo: { yes: 'Yes', no: 'No', unknown: 'Not sure' },
  calf: { none: 'No calf', female: 'Female calf (bachhi)', male: 'Male calf (bachha)' },
  vaccines: { fmd: 'FMD (Khurpaka-Muhpaka)', hs: 'HS (Galghotu)', bq: 'BQ (Lungdi)', lsd: 'Lumpy skin (LSD)', brucellosis: 'Brucellosis', theileria: 'Theileria' },
  transport: { seller: 'Seller can bring the cow', buyer: 'Amrit Dairy to pick up', discuss: 'To discuss' },
} as const
