/**
 * Convert Longitude/Latitude to an array coordinate [lng, lat]
 * Simple utility ensuring standard format
 * @param {number|string} lng - Longitude
 * @param {number|string} lat - Latitude
 * @returns {[number, number]} Coordinate array
 */
export function lngLatToCoords(lng, lat) {
  return [Number(lng), Number(lat)]
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  
  return Number(d.toFixed(2)) // Return distance with 2 decimal places
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degree value
 * @returns {number} Radian value
 */
function toRad(deg) {
  return deg * (Math.PI / 180)
}

/**
 * Check if a point is inside a bounding box
 * @param {[number, number]} point - [lng, lat]
 * @param {[number, number, number, number]} bbox - [minLng, minLat, maxLng, maxLat]
 * @returns {boolean} True if inside
 */
export function isPointInBBox(point, bbox) {
  const [lng, lat] = point
  const [minLng, minLat, maxLng, maxLat] = bbox
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat
}
