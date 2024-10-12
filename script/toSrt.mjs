import { writeFile } from 'node:fs'
import SrtParser from 'srt-parser-2'

import tracksData from '../src/data/tracks.json' assert { type: 'json' }

const slug = 'constant-vigilance'

const transcript = tracksData.find(track => track.slug === slug).transcription
transcript.sort((l1, l2) => l1.start - l2.start)
writeFile(`./${slug}.srt`, new SrtParser().toSrt(transcript.map(convert)), err => {
  if (err) {
    console.error(err)
    return
  }

  console.log('Wrote file')
})

function convert ({ text, start, end }, i) {
  return {
    id: (i + 1).toFixed(0),
    text,
    startSeconds: start,
    endSeconds: end,
    startTime: encodeTime(start),
    endTime: encodeTime(end),
  }
}

function encodeTime (secs) {
  secs += 9
  const minsPart = Math.floor(secs / 60)
  const secsPart = secs % 60
  const minsString = minsPart.toFixed(0).padStart(2, '0')
  const secsString = secsPart.toFixed(3).padStart(6, '0').replace('.', ',')
  return `00:${minsString}:${secsString}`
}
