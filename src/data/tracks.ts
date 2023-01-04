import tracksJson from './tracks.json'
import { Transcription } from '@components/player/Transcript.vue'

export interface Track {
  title: string
  slug: string
  duration: number
  artist: string
  credits: string
  bgColor: string
  transcript?: Transcription
}

export const tracks: Track[] = tracksJson
