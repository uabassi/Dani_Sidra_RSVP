import { randomBytes } from 'crypto'

export function normalizeFamilyName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function createInviteToken(): string {
  return randomBytes(16).toString('hex')
}

export function createId(): string {
  return randomBytes(12).toString('hex')
}

export type CsvRow = {
  name: string
  invitedCount: number
}

/** Parse CSV with two columns: family name, invited count. Header row optional. */
export function parseFamiliesCsv(text: string): { rows: CsvRow[]; errors: string[] } {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const rows: CsvRow[] = []
  const errors: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const cols = splitCsvLine(line)
    if (cols.length < 2) {
      errors.push(`Line ${i + 1}: expected two columns`)
      continue
    }

    const name = cols[0]?.trim() ?? ''
    const countRaw = cols[1]?.trim() ?? ''

    // Skip header row
    if (i === 0 && isHeaderRow(name, countRaw)) continue

    if (!name) {
      errors.push(`Line ${i + 1}: missing family name`)
      continue
    }

    const invitedCount = Number.parseInt(countRaw, 10)
    if (!Number.isFinite(invitedCount) || invitedCount < 1) {
      errors.push(`Line ${i + 1}: invited count must be a positive integer`)
      continue
    }

    rows.push({ name, invitedCount })
  }

  return { rows, errors }
}

function isHeaderRow(name: string, count: string): boolean {
  const n = name.toLowerCase()
  const c = count.toLowerCase()
  return (
    (n.includes('family') || n.includes('name') || n === 'guest') &&
    (c.includes('invit') || c.includes('count') || c.includes('people') || c.includes('guest'))
  )
}

function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}
