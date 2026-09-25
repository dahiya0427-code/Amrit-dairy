import type { SVGProps } from 'react'

/** Line icons (Lucide-style, 1.75 stroke) plus custom dairy icons. */
const paths: Record<string, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  shop: <><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2.8l2.2 12h11.3l2-8.5H6.2" /></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7.5" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <><path d="M5 12h14" /></>,
  phone: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  map: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  pause: <><path d="M9 5v14M15 5v14" /></>,
  play: <><path d="M7 5l12 7-12 7V5Z" /></>,
  star: <><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></>,
  leaf: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19c3-4 6-6 10-8" /></>,
  cow: <><path d="M4 8c-1 0-2-1-2-2.5M20 8c1 0 2-1 2-2.5" /><path d="M6 7c1.5-1.5 3.5-2 6-2s4.5.5 6 2l-1 4.5c-.3 1.5 0 3 .5 4.5l.5 2a2 2 0 0 1-2 2.5H8a2 2 0 0 1-2-2.5l.5-2c.5-1.5.8-3 .5-4.5L6 7Z" /><circle cx="9.5" cy="11" r=".6" /><circle cx="14.5" cy="11" r=".6" /><path d="M10 16.5h4" /></>,
  milk: <><path d="M9 2h6v3l2 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l2-3V2Z" /><path d="M7 12h10" /></>,
  ghee: <><path d="M7 6h10v2a5 5 0 0 1 2 4v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6a5 5 0 0 1 2-4V6Z" /><path d="M8 3h8v3H8z" /><path d="M5 14h14" /></>,
  jar: <><rect x="6" y="3" width="12" height="3" rx="1" /><path d="M6 6h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6Z" /><path d="M6 11h12M6 16h12" /></>,
  lab: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7.5 15h9" /></>,
  box: <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="m3 7.5 9 4.5 9-4.5M12 12v9" /></>,
  truck: <><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  support: <><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19a3 3 0 0 1-3 3h-3" /></>,
  cold: <><path d="M12 2v20M4.9 6l14.2 12M4.9 18 19.1 6" /></>,
  shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  whatsapp: <><path d="M4 20l1.3-4A8.5 8.5 0 1 1 8.2 19L4 20Z" /><path d="M9 8.5c0 3 2.5 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2.4-1.8-2.8-2.8l.8-1-1-2L9 8.5Z" /></>,
  facebook: <><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8Z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" /></>,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3V9Z" /></>,
}

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, ...props }: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name] ?? paths.leaf}
    </svg>
  )
}
