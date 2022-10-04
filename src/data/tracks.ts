import tracksJson from './tracks.json'

export interface Track {
  title: string
  slug: string
}

export const tracks = tracksJson as Track[]

export function fromSlug (slug: string): Track|null {
  return tracks.find(track => track.slug === slug) ?? null
}
