import tracksJson from './tracks.json'

export interface Track {
  title: string
  slug: string
  duration: number
  artist: string
  bgColor?: string
}

export const tracks = tracksJson as Track[]
