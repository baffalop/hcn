export interface Track {
  title: string
  slug: string
}

export const tracks: Track[] = [
  { title: 'Constant Vigilance', slug: 'constant-vigilance' },
  { title: 'Restrictions and Ejection', slug: 'restrictions-and-ejection' },
  { title: 'Saying Goodbye', slug: 'saying-goodbye' },
  { title: 'Wire and Fences', slug: 'wire-and-fences' },
]

export function fromSlug (slug: string): Track|null {
  return tracks.find(track => track.slug === slug) ?? null
}
