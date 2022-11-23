import { precacheAndRoute, PrecacheEntry } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope
  & typeof globalThis
  & { __WB_MANIFEST: PrecacheEntry[] }

precacheAndRoute(self.__WB_MANIFEST)
