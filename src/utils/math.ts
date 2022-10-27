export function delta (x: number, y: number): number {
  return Math.abs(x - y)
}

export function clamp (value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
