import { notFound } from 'next/navigation'

// Any unknown URL inside a locale renders the localized 404 page.
export default function CatchAll() {
  notFound()
}
