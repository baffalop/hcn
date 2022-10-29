import { basename } from 'node:path'
import { promises as fs } from 'node:fs'

import { globby } from 'globby'
import { getAudioDurationInSeconds } from 'get-audio-duration'
import SrtParser from 'srt-parser-2'

import tracksData from '../src/data/tracks.json' assert { type: 'json' }

const PATTERN = 'public/audio/*.mp3'
const DATA_PATH = 'src/data/tracks.json'

const paths = await globby(PATTERN)

const parser = new SrtParser()

for (const path of paths) {
  const slug = basename(path, '.mp3')
  const duration = await getAudioDurationInSeconds(path)

  console.log(`Extracted duration for slug ${slug}:`, duration)

  const trackIndex = tracksData.findIndex(track => track.slug === slug)
  if (trackIndex === -1) {
    console.error('Track not found in JSON for slug:', slug)
    continue
  }

  tracksData[trackIndex].duration = duration

  const transcript = await tryReadSrt(slug)
  if (transcript) {
    tracksData[trackIndex].transcript = transcript
  }
}

const dataEncoded = JSON.stringify(tracksData, null, 2)

try {
  await fs.writeFile(DATA_PATH, dataEncoded + '\n')
  console.log('Updated track data', tracksData)
} catch (e) {
  console.error(e)
}

async function tryReadSrt (slug) {
  const srtPath = `src/data/${slug}.srt`

  try {
    const srt = await fs.readFile(srtPath, 'utf8')
    const parsed = new SrtParser().fromSrt(srt)
    console.log(`found and parsed srt for ${slug}`)

    return parsed.map(({ text, startSeconds, endSeconds }) => ({
      text,
      start: startSeconds,
      end: endSeconds,
    }))
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.warn(`No srt found for ${slug}`)
    } else {
      console.error(`Error reading srt at ${srtPath}`, e)
    }

    return null
  }
}
