import { mockRequest } from './client';

export const reportApi = {
  // 查询数据
  async queryData(params) {
    // Mock response
    const list = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      region: ['浉河区', '平桥区', '罗山县'][i % 3],
      category: ['交通', '民生', '环保'][i % 3],
      title: `模拟数据条目 ${i + 1}`,
      value: Math.floor(Math.random() * 100)
    }));
    
    return mockRequest({
      list: list,
      total: 100
    });
  },

  // 获取统计数据
  async getStatistics(params) {
    // Mock response
    const { granularity = 'day' } = params;
    
    let xAxis = [];
    if (granularity === 'day') {
      xAxis = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    } else if (granularity === 'week') {
      xAxis = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    } else {
      xAxis = ['1日', '5日', '10日', '15日', '20日', '25日', '30日'];
    }

    return mockRequest({
      trend: {
        xAxis,
        series: [
          { name: '事件总量', data: xAxis.map(() => Math.floor(Math.random() * 100)) },
          { name: '已处理', data: xAxis.map(() => Math.floor(Math.random() * 80)) }
        ]
      },
      distribution: [
        { name: '交通拥堵', value: 35 },
        { name: '环境污染', value: 25 },
        { name: '公共设施', value: 20 },
        { name: '噪音扰民', value: 15 },
        { name: '其他', value: 5 }
      ],
      comparison: {
        categories: ['浉河区', '平桥区', '罗山县', '光山县', '新县'],
        series: [
          { name: '本期', data: [120, 132, 101, 134, 90] },
          { name: '上期', data: [220, 182, 191, 234, 290] }
        ]
      }
    });
  },

  // 生成报告
  async generateReport(params) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockRequest({
      success: true,
      url: `mock://report-${Date.now()}.${params.format}`,
      preview: {
        title: '智舆 舆情分析报告',
        date: new Date().toLocaleDateString(),
        summary: '本周期内舆情总体平稳，交通类事件有所上升，需重点关注。',
        charts: ['trend', 'pie']
      }
    });
  }
};
