export function formatDurationMinutes(
  durationMinutes: number
) {
  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0
  ) {
    return '';
  }

  if (durationMinutes % 60 === 0) {
    return `${durationMinutes / 60} ч`;
  }

  return `${durationMinutes} мин`;
}