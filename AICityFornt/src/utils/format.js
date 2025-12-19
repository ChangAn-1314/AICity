/**
 * Format a date object or timestamp into a readable string
 * @param {Date|number|string} date - The date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * Format a number with thousand separators and optional decimals
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Format a level/priority string into a localized display label
 * @param {string} level - The level (high, medium, low)
 * @returns {string} Localized label
 */
export function formatLevel(level) {
  const map = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
    critical: '极高风险',
    normal: '正常'
  }
  return map[level?.toLowerCase()] || level || '未知'
}

/**
 * Get color code for a risk level
 * @param {string} level - The risk level
 * @returns {string} Hex color code or Tailwind class suffix
 */
export function getLevelColor(level) {
  const colors = {
    high: '#ef4444', // red-500
    medium: '#f97316', // orange-500
    low: '#22c55e', // green-500
    critical: '#dc2626', // red-600
    normal: '#3b82f6' // blue-500
  }
  return colors[level?.toLowerCase()] || '#94a3b8' // slate-400
}
