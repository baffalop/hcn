import tracksJson from './tracks.json'
import { Transcription } from '@components/player/Transcript.vue'

export interface Track {
  title: string
  slug: string
  duration: number
  artist: string
  bgColor?: string
  transcription?: Transcription
}

export const tracks = tracksJson as Track[]
