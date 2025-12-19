import { mockRequest } from './client'

export const decisionApi = {
  // 获取决策选项
  getOptions(hotspotId) {
    return mockRequest([
      { 
        id: 'opt1', 
        label: '增加警力疏导', 
        description: '派遣额外2组交警前往关键路口',
        risk: 'low',
        cost: 'medium'
      },
      { 
        id: 'opt2', 
        label: '实施临时交通管制', 
        description: '封闭相关匝道，分流车辆',
        risk: 'medium',
        cost: 'high'
      },
      { 
        id: 'opt3', 
        label: '发布全网路况预警', 
        description: '通过短信、广播、APP推送拥堵信息',
        risk: 'low',
        cost: 'low'
      }
    ])
  },

  // 执行模拟
  simulate(hotspotId, decisionId) {
    return mockRequest({
      hotspotId,
      decisionId,
      result: {
        score: 85,
        comparison: {
          optimistic: 90,
          neutral: 80,
          pessimistic: 60
        },
        impact: {
          traffic_flow: '+30%',
          complaints: '-20%'
        },
        recommendation: '建议结合发布预警和增加警力，效果最佳。'
      }
    }, 1500) // Simulate longer processing time
  },

  // 自定义决策模拟
  customSimulate(hotspotId, description) {
    return mockRequest({
      hotspotId,
      customDescription: description,
      result: {
        score: 78,
        comparison: {
          optimistic: 85,
          neutral: 75,
          pessimistic: 55
        },
        impact: {
          traffic_flow: '+15%',
          complaints: '-10%'
        },
        analysis: `针对"${description}"的模拟分析显示，该方案在短期内有效，但可能产生副作用。`
      }
    }, 2000)
  }
}

export const useDecisionApi = () => decisionApi
