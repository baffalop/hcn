import { onUnmounted, ref, Ref, watch } from 'vue'

import { Track } from '@/data/tracks'

export function useMediaMetadata (track: Ref<Track>, playing: Ref<boolean>) {
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
      setMediaMetadataFrom(track.value)
    }
  })

  onUnmounted(() => {
    clearMediaMetadata()
  })
}

function setMediaMetadataFrom (track: Track): void {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: 'Linda O\'Keefe',
  })
}

function clearMediaMetadata (): void {
  navigator.mediaSession.playbackState = 'none'
}
