export function formatSecs (secs: number): string {
  const minsPart = formatPart(secs / 60)
  const secsPart = formatPart(secs % 60)
  return `${minsPart}:${secsPart}`
}

function formatPart (n: number): string {
  return Math.floor(n).toFixed(0).padStart(2, '0')
}
