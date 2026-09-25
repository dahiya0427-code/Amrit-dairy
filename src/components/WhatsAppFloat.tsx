import { whatsappLink } from '@/lib/site'
import { Icon } from './Icon'

export function WhatsAppFloat({ phone, label }: { phone: string; label: string }) {
  return (
    <a
      href={whatsappLink(phone, 'Hi Amrit Dairy!')}
      target="_blank"
      rel="noopener"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-float hover:scale-105 md:grid"
      aria-label={label}
    >
      <Icon name="whatsapp" size={28} />
    </a>
  )
}
