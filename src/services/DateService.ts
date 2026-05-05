export function getLocalToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date: Date, n: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}

export function formatDate(date: Date, fmt: string): string {
  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1);
  const d = String(date.getDate());
  // Longer tokens must be replaced before shorter ones to avoid partial collision
  return fmt
    .replace('YYYY', y)
    .replace('MM', m.padStart(2, '0'))
    .replace('DD', d.padStart(2, '0'))
    .replace('M', m)
    .replace('D', d);
}

export function parseDateFromFilename(name: string, fmt: string): Date | null {
  // Collect token order as they appear in the format string
  const tokenOrder = [...fmt.matchAll(/YYYY|MM|DD|M|D/g)].map(m => m[0]);

  // Build regex pattern, replacing longer tokens first
  let pattern = fmt;
  pattern = pattern.replace(/YYYY/g, '(\\d{4})');
  pattern = pattern.replace(/MM/g, '(\\d{1,2})');
  pattern = pattern.replace(/DD/g, '(\\d{1,2})');
  pattern = pattern.replace(/M/g, '(\\d{1,2})');
  pattern = pattern.replace(/D/g, '(\\d{1,2})');

  const basename = name.replace(/\.note$/, '');
  const match = basename.match(new RegExp(`^${pattern}$`));
  if (!match) {
    return null;
  }

  let year = 0;
  let month = 0;
  let day = 0;
  tokenOrder.forEach((token, i) => {
    const val = parseInt(match[i + 1], 10);
    if (token === 'YYYY') {
      year = val;
    } else if (token === 'MM' || token === 'M') {
      month = val;
    } else if (token === 'DD' || token === 'D') {
      day = val;
    }
  });

  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

export function getDayOffset(date: Date): number {
  const today = getLocalToday();
  const diff = date.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
