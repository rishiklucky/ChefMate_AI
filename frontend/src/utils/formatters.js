/**
 * Formats duration in minutes into a human-readable string.
 * - If less than 60 mins: "X min" or "X mins"
 * - If 60 mins or more: "H hr M mins" or "H hrs M mins" (e.g. 720 mins -> "12 hrs", 90 mins -> "1 hr 30 mins")
 */
export function formatDuration(totalMinutes) {
  const num = parseInt(totalMinutes, 10);
  if (isNaN(num) || num <= 0) return '0 mins';

  if (num < 60) {
    return `${num} ${num === 1 ? 'min' : 'mins'}`;
  }

  const hours = Math.floor(num / 60);
  const mins = num % 60;

  const hrUnit = hours === 1 ? 'hr' : 'hrs';

  if (mins === 0) {
    return `${hours} ${hrUnit}`;
  }

  const minUnit = mins === 1 ? 'min' : 'mins';
  return `${hours} ${hrUnit} ${mins} ${minUnit}`;
}
