import { cleanupOutdatedCaches, precacheAndRoute, PrecacheEntry } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope
  & typeof globalThis
  & { __WB_MANIFEST: PrecacheEntry[] }

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ request, sameOrigin }) => sameOrigin && ['document', 'script', 'style'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'script',
  })
)

registerRoute(
  ({ request, sameOrigin }) => sameOrigin && ['image', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'decorative',
  })
)

registerRoute(
  ({ request, sameOrigin }) => sameOrigin && ['audio', 'video'].includes(request.destination),
  new CacheFirst({
    cacheName: 'media',
  })
)
