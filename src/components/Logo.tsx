import Image from 'next/image'

/** The Amrit Dairy logo (gold "A" with the drop, AMRIT DAIRY, Purity · Trust · Nourishment). */
export function BrandLogo({ height = 72, className = '', priority = false }: { height?: number; className?: string; priority?: boolean }) {
  const width = Math.round((height * 412) / 360)
  return <Image src="/images/amrit-logo.png" alt="Amrit Dairy" width={width} height={height} priority={priority} className={className} />
}
