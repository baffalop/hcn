import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { RangeRequestsPlugin } from 'workbox-range-requests'

declare const self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

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
    plugins: [
      new RangeRequestsPlugin(),
    ],
  })
)
