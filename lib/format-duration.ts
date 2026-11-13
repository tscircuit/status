export function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.max(0, Math.round(milliseconds / 1000 / 60))
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}hr ${minutes.toString().padStart(2, "0")}min`
  }
  return `${totalMinutes}min`
}
