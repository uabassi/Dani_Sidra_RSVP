/** Walima event details shared by invitation + calendar links */

export const EVENT = {
  title: 'Walima of Danieal & Sidra',
  description: 'Join us in celebrating the Walima of Danieal & Sidra.',
  location: 'Cherry Blossom Banquet Hall, 46110 Lake Center Plaza, Sterling, VA 20165',
  /** Local start: Thu Aug 20, 2026 6:00 PM America/New_York */
  startLocal: '20260820T180000',
  /** Assume ~5 hour reception */
  endLocal: '20260820T230000',
  /** UTC equivalents (EDT = UTC-4) for Google Calendar */
  startUtc: '20260820T220000Z',
  endUtc: '20260821T030000Z',
} as const

function escapeIcsText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function buildIcsContent() {
  const uid = `walima-danieal-sidra-20260820@dani-sidra`
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Danieal & Sidra//Walima RSVP//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/New_York:${EVENT.startLocal}`,
    `DTEND;TZID=America/New_York:${EVENT.endLocal}`,
    `SUMMARY:${escapeIcsText(EVENT.title)}`,
    `DESCRIPTION:${escapeIcsText(EVENT.description)}`,
    `LOCATION:${escapeIcsText(EVENT.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function getGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: EVENT.title,
    dates: `${EVENT.startUtc}/${EVENT.endUtc}`,
    details: EVENT.description,
    location: EVENT.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function downloadIcsFile() {
  const blob = new Blob([buildIcsContent()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'danieal-sidra-walima.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
