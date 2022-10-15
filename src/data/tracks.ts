import tracksJson from './tracks.json'

export interface Track {
  title: string
  slug: string
  duration: number
  bgColor?: string
}

export const tracks = tracksJson as Track[]
