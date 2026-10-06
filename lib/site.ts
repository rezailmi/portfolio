/** Canonical public site origin. Accepts either env name used in deploy configs. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.rezailmi.com'
