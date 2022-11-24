import { Ref, onUnmounted, watch, ref } from 'vue'

import { Track } from '@/data/tracks'

export function useMediaSession (track: Ref<Track>, playing: Ref<boolean>, time: Ref<number>) {
  const hasPlayed = ref(false)
  watch(() => playing.value, playing => {
    if (playing) hasPlayed.value = true
  })

  watch(() => track.value, () => {
    hasPlayed.value = false
    clearMediaMetadata()
  })

  watch(() => hasPlayed.value, hasPlayed => {
    if (hasPlayed && track.value) {
      setupHandlers()
      setMediaMetadataFrom(track.value)
    }
  })

  onUnmounted(() => {
    clearMediaMetadata()
  })

  function setupHandlers (): void {
    const session = navigator.mediaSession
    session.setActionHandler('play', () => playing.value = true)
    session.setActionHandler('pause', () => playing.value = false)
    session.setActionHandler('pause', () => playing.value = false)
    session.setActionHandler('seekbackward', seek(-1))
    session.setActionHandler('seekforward', seek(1))
    session.setActionHandler('seekto', ({ seekTime }) => {
      if (seekTime != null) {
        time.value = seekTime
      }
    })
  }

  const seek = (multiplier: number): MediaSessionActionHandler => ({ seekOffset }) => {
    time.value += (seekOffset ?? 10) * multiplier
  }
}

function setMediaMetadataFrom ({ title, artist, slug }: Track): void {
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    artwork: [
      { src: `/img/album-art/${slug}-192x192.png`, sizes: '192x192', type: 'image/png' },
      { src: `/img/album-art/${slug}-512x512.png`, sizes: '512x512', type: 'image/png' },
      { src: `/img/album-art/${slug}-1024x1024.png`, sizes: '1024x1024', type: 'image/png' },
    ],
  })
}

function clearMediaMetadata (): void {
  navigator.mediaSession.playbackState = 'none'
}
