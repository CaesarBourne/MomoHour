/**
 * "YYYY-MM-DD" in LOCAL time — NOT `date.toISOString().slice(0, 10)`, which
 * uses UTC. Schedule dates/hours are entered and compared as local
 * wall-clock values throughout this feature (matching the backend's
 * `combineDateAndHour` in ECW/src/momoHour/rewardEngine.js), so using the
 * UTC date here would misjudge "today" for up to an hour (or more,
 * depending on the browser's UTC offset) around local midnight.
 */
export function localDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
