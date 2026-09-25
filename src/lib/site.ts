/** Fallback business facts (Doc 01). Editable values live in the Site settings global. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://amritdairy.in').replace(/\/$/, '')

export const BUSINESS = {
  name: 'Amrit Dairy',
  ordersPhone: '+91 77000 04877',
  cowPhone: '+91 80595 93666',
  email: 'contact@amritdairy.in',
  street: 'Near Anup Sports Village, Rajhbhaya, Garhi Brahmnan',
  city: 'Sonipat',
  region: 'Haryana',
  postalCode: '131001',
  gstin: '06CKFPC6104C1ZW',
  fssai: '10826020000285',
  udyam: 'UDYAM-HR-18-0074290',
}

export const digitsOnly = (phone: string) => phone.replace(/\D/g, '')

export const whatsappLink = (phone: string, text?: string) =>
  `https://wa.me/${digitsOnly(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const telLink = (phone: string) => `tel:+${digitsOnly(phone)}`
