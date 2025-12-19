import { mockRequest } from './client'

export const mapApi = {
  // 获取城市基础数据
  getCityData(cityName) {
    // 信阳市中心坐标
    return mockRequest({
      name: cityName || '信阳市',
      center: [114.0913, 32.1477],
      boundaryId: '411500', // 信阳市 adcode
      zoom: 14
    })
  },

  // 获取区域边界数据 (GeoJSON)
  getRegionBoundary(adcode) {
    // In reality, this might fetch from a GeoJSON file or an API service like AMap district search wrapper
    // For now, we mock a simple response structure, but usually this is handled by AMap plugin directly
    // or we fetch a local geojson file
    return mockRequest({
      type: 'FeatureCollection',
      features: [] // detailed geojson would be here
    })
  }
}
