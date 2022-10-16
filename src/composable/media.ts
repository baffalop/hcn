import { Ref, onUnmounted, watch } from 'vue'

import { Track } from '@/data/tracks'

export function useMediaMetadata (track: Ref<Track>, hasPlayed: Ref<boolean>) {
  watch(() => track.value, () => {
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

function setMediaMetadataFrom ({ title, artist }: Track): void {
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
  })
}

function clearMediaMetadata (): void {
  navigator.mediaSession.playbackState = 'none'
}
