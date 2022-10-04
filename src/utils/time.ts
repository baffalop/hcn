export function formatSecs (secs: number): string {
  const minsPart = Math.floor(secs / 60).toFixed(0).padStart(2, '0')
  const secsPart = (secs % 60).toFixed(0).padStart(2, '0')
  return `${minsPart}:${secsPart}`
}

