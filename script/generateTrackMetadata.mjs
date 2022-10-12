import { basename } from 'node:path'
import { writeFile } from 'node:fs'

import { globby } from 'globby'
import { getAudioDurationInSeconds } from 'get-audio-duration'

import tracksData from '../src/data/tracks.json' assert { type: 'json' }

const PATTERN = 'public/audio/*.mp3'
const DATA_PATH = 'src/data/tracks.json'

const paths = await globby(PATTERN)

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
}

const dataEncoded = JSON.stringify(tracksData, null, 2)

writeFile(DATA_PATH, dataEncoded + '\n', err => {
  if (err) {
    console.error(err)
    return
  }

  console.log('Updating track data', tracksData)
})
