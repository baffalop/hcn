import tracksJson from './tracks.json'

export interface Track {
  title: string
  slug: string
  duration: number
}

export const tracks = tracksJson as Track[]
