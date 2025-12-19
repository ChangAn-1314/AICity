import { mockRequest } from './client'

/**
 * Hotspot 数据结构（对齐后端 design.md 模型）
 * @typedef {Object} Hotspot
 * @property {number} id - 主键
 * @property {string} title - 标题
 * @property {string} content - 详细内容
 * @property {string} source - 来源平台
 * @property {string} source_url - 原始链接
 * @property {string} media_type - 媒体类型 (text/image/video)
 * @property {string[]} media_urls - 媒体文件 URL 数组
 * @property {string} city - 城市
 * @property {string} district - 区县
 * @property {{lng: number, lat: number}} location - 坐标
 * @property {number} heat - 热度值
 * @property {string} sentiment - 情感倾向 (positive/neutral/negative)
 * @property {number} sentiment_score - 情感分数 (-1.0 ~ 1.0)
 * @property {string[]} keywords - 关键词数组
 * @property {string} summary - AI 摘要
 * @property {string} status - 状态 (active/archived/deleted)
 * @property {string} published_at - 发布时间
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 更新时间
 * --- 前端扩展字段 ---
 * @property {string} level - 预警级别 (high/medium/low) - 前端 UI 用
 * @property {string} category - 分类 - 前端 UI 用
 * @property {string} scope - 地域范围 (national/province/city) - 前端筛选用
 * @property {string} province - 省份 - 前端筛选用
 * @property {number[]} relatedIds - 关联舆情 ID - 前端展示用
 */

// ========== 2025年12月9日 全国舆情模拟数据 ==========
const demoHotspots = [
  // === 全国级别 ===
  { id: 1001, title: '双十二消费维权舆情爆发',
    content: '双十二期间，多平台出现虚假宣传、先涨后降、售后维权难等问题，消费者投诉量较平日增长300%。',
    source: '微博', source_url: 'https://weibo.com/example/1001',
    media_type: 'text', media_urls: [],
    city: '北京市', district: '朝阳区',
    location: { lng: 116.4074, lat: 39.9042 },
    heat: 98500, sentiment: 'negative', sentiment_score: -0.45,
    keywords: ['双十二', '虚假宣传', '消费维权', '促销套路'],
    summary: '双十二期间虚假宣传、促销套路、售后维权难等问题集中曝光，多地消费者投诉激增',
    status: 'active', published_at: new Date().toISOString(),
    level: 'high', category: 'consumer', scope: 'national', relatedIds: [2008, 2005, 3004] },
  { id: 1002, title: '冬季供暖保障问题',
    content: '多地居民反映供暖温度不达标，部分老旧小区管网老化严重导致停暖，老年群体供暖保障问题突出。',
    source: '今日头条', source_url: 'https://toutiao.com/example/1002',
    media_type: 'text', media_urls: [],
    city: '呼和浩特市', district: '新城区',
    location: { lng: 111.6102, lat: 40.7616 },
    heat: 87200, sentiment: 'negative', sentiment_score: -0.50,
    keywords: ['供暖', '温度不达标', '管网老化', '民生'],
    summary: '多地供暖不达标、管网老化导致停暖，老年群体供暖保障成焦点',
    status: 'active', published_at: new Date(Date.now() - 3600000).toISOString(),
    level: 'high', category: 'livelihood', scope: 'national', relatedIds: [2007, 3002] },
  { id: 1003, title: '流感疫情防控形势',
    content: '冬季流感高发，多地医院发热门诊排队超3小时，部分地区医疗资源紧张。',
    source: '央视新闻', source_url: 'https://news.cctv.com/example/1003',
    media_type: 'text', media_urls: [],
    city: '上海市', district: '浦东新区',
    location: { lng: 121.4737, lat: 31.2304 },
    heat: 65800, sentiment: 'neutral', sentiment_score: -0.20,
    keywords: ['流感', '发热门诊', '医疗资源', '防控'],
    summary: '冬季流感高发，部分地区医疗资源紧张，发热门诊排队过长引发讨论',
    status: 'active', published_at: new Date(Date.now() - 7200000).toISOString(),
    level: 'medium', category: 'health', scope: 'national', relatedIds: [3006] },
  { id: 1004, title: '农民工欠薪年末集中爆发',
    content: '年末工资结算期，多地曝出建筑企业欠薪事件，涉及农民工数万人，总金额超亿元。',
    source: '人民日报', source_url: 'https://people.com.cn/example/1004',
    media_type: 'text', media_urls: [],
    city: '西安市', district: '未央区',
    location: { lng: 108.9398, lat: 34.3416 },
    heat: 78900, sentiment: 'negative', sentiment_score: -0.62,
    keywords: ['欠薪', '农民工', '讨薪', '建筑企业'],
    summary: '年末工资结算期，多地建筑企业欠薪，农民工维权引发广泛关注',
    status: 'active', published_at: new Date(Date.now() - 10800000).toISOString(),
    level: 'high', category: 'livelihood', scope: 'national', relatedIds: [3003] },
  { id: 1005, title: '网络直播打赏乱象整治',
    content: '中央网信办"清朗"专项行动取得阶段性成果，处置违规直播间7.3万余个。',
    source: '新华社', source_url: 'https://xinhuanet.com/example/1005',
    media_type: 'text', media_urls: [],
    city: '成都市', district: '高新区',
    location: { lng: 104.0668, lat: 30.5728 },
    heat: 45600, sentiment: 'positive', sentiment_score: 0.55,
    keywords: ['清朗行动', '直播整治', '网络治理', '监管'],
    summary: '中央网信办"清朗"专项行动处置违规直播间7.3万余个',
    status: 'active', published_at: new Date(Date.now() - 14400000).toISOString(),
    level: 'medium', category: 'policy', scope: 'national', relatedIds: [2008] },
  // === 省级别 ===
  { id: 2001, title: '湖南郴州店主举报公职人员',
    content: '北湖区烟花爆竹店主实名举报公职人员违纪违法，并在社交媒体发布饮用疑似农药视频引发关注。',
    source: '抖音', source_url: 'https://douyin.com/example/2001',
    media_type: 'video', media_urls: ['/videos/chenzhou_report.mp4'],
    city: '郴州市', district: '北湖区',
    location: { lng: 113.0151, lat: 25.7702 },
    heat: 125000, sentiment: 'negative', sentiment_score: -0.75,
    keywords: ['举报', '公职人员', '违纪', '维权'],
    summary: '北湖区烟花爆竹店主实名举报公职人员违纪，并发布饮用疑似"敌草快"视频',
    status: 'active', published_at: new Date().toISOString(),
    level: 'high', category: 'government', scope: 'province', province: '湖南省', relatedIds: [2004, 3007] },
  { id: 2002, title: '云南大理采矿权违规出让',
    content: '云龙县自然资源局被指以协议出让方式将千万吨级采矿权延续至失信企业，涉嫌国有资产流失。',
    source: '澎湃新闻', source_url: 'https://thepaper.cn/example/2002',
    media_type: 'text', media_urls: [],
    city: '大理州', district: '云龙县',
    location: { lng: 100.2250, lat: 25.5893 },
    heat: 89500, sentiment: 'negative', sentiment_score: -0.82,
    keywords: ['采矿权', '违规出让', '失信企业', '国资流失'],
    summary: '云龙县自然资源局被指以协议出让方式将千万吨级采矿权延续至失信企业',
    status: 'active', published_at: new Date(Date.now() - 3600000).toISOString(),
    level: 'high', category: 'government', scope: 'province', province: '云南省', relatedIds: [2003] },
  { id: 2003, title: '甘肃兰州3亿国资项目闲置',
    content: '华夏人文始祖园耗资逾3亿元建设，因未获黄委会审批已闲置超10年，引发对政绩工程的讨论。',
    source: '新京报', source_url: 'https://bjnews.com.cn/example/2003',
    media_type: 'image', media_urls: ['/images/lanzhou_project.jpg'],
    city: '兰州市', district: '西固区',
    location: { lng: 103.8343, lat: 36.0611 },
    heat: 76800, sentiment: 'negative', sentiment_score: -0.78,
    keywords: ['国资闲置', '政绩工程', '审批', '浪费'],
    summary: '华夏人文始祖园耗资逾3亿元，因未获黄委会审批已闲置超10年',
    status: 'active', published_at: new Date(Date.now() - 7200000).toISOString(),
    level: 'high', category: 'government', scope: 'province', province: '甘肃省', relatedIds: [2002] },
  { id: 2004, title: '广东广州街头突发火情',
    content: '海珠区工业大道北发生车辆碰撞起火事故，车油泄漏蔓延至路旁电动车，消防已扑灭。',
    source: '南方都市报', source_url: 'https://nandu.com/example/2004',
    media_type: 'video', media_urls: ['/videos/guangzhou_fire.mp4'],
    city: '广州市', district: '海珠区',
    location: { lng: 113.2644, lat: 23.0936 },
    heat: 95200, sentiment: 'negative', sentiment_score: -0.65,
    keywords: ['火情', '车祸', '电动车', '消防'],
    summary: '海珠区工业大道北车辆碰撞后起火，车油泄漏蔓延至路旁电动车',
    status: 'active', published_at: new Date(Date.now() - 1800000).toISOString(),
    level: 'high', category: 'safety', scope: 'province', province: '广东省', relatedIds: [2001, 3007] },
  { id: 2005, title: '湖北黄冈老年人保健品诈骗',
    content: '35名老人被"免费领鸡蛋"诱骗购买假奶粉，销售人员以养生讲座为名牟取暴利。',
    source: '楚天都市报', source_url: 'https://ctdsb.com/example/2005',
    media_type: 'text', media_urls: [],
    city: '黄冈市', district: '黄州区',
    location: { lng: 114.8722, lat: 30.4461 },
    heat: 45600, sentiment: 'negative', sentiment_score: -0.55,
    keywords: ['保健品诈骗', '老年人', '假奶粉', '养生讲座'],
    summary: '35名老人被"免费领鸡蛋"诱骗购买假奶粉，销售人员牟取暴利',
    status: 'active', published_at: new Date(Date.now() - 10800000).toISOString(),
    level: 'medium', category: 'consumer', scope: 'province', province: '湖北省', relatedIds: [1001, 2008] },
  { id: 2006, title: '黑龙江哈尔滨冰雪旅游投诉',
    content: '冰雪旅游热度攀升，景区排队过长、餐饮价格虚高、出租车宰客等问题频发。',
    source: '黑龙江日报', source_url: 'https://hljnews.cn/example/2006',
    media_type: 'text', media_urls: [],
    city: '哈尔滨市', district: '道里区',
    location: { lng: 126.5340, lat: 45.8038 },
    heat: 52300, sentiment: 'neutral', sentiment_score: 0.0,
    keywords: ['冰雪旅游', '排队', '价格虚高', '服务投诉'],
    summary: '冰雪旅游热度攀升，景区排队过长、餐饮价格虚高等问题频发',
    status: 'active', published_at: new Date(Date.now() - 14400000).toISOString(),
    level: 'medium', category: 'tourism', scope: 'province', province: '黑龙江省', relatedIds: [3007] },
  { id: 2007, title: '河北多地供暖温度不达标',
    content: '管网老化、热源不足导致多个小区供暖温度低于18度标准，居民多次投诉未果。',
    source: '燕赵都市报', source_url: 'https://yzdsb.com/example/2007',
    media_type: 'text', media_urls: [],
    city: '石家庄市', district: '长安区',
    location: { lng: 114.5149, lat: 38.0428 },
    heat: 38900, sentiment: 'negative', sentiment_score: -0.52,
    keywords: ['供暖', '温度不达标', '管网老化', '投诉'],
    summary: '管网老化、热源不足导致多个小区供暖温度低于标准',
    status: 'active', published_at: new Date(Date.now() - 18000000).toISOString(),
    level: 'medium', category: 'livelihood', scope: 'province', province: '河北省', relatedIds: [1002, 3002] },
  { id: 2008, title: '江苏南京直播带货虚假宣传',
    content: '某网红主播销售的"进口护肤品"被检测为国产假货，涉及消费者数千人，金额超百万。',
    source: '扬子晚报', source_url: 'https://yangtse.com/example/2008',
    media_type: 'text', media_urls: [],
    city: '南京市', district: '鼓楼区',
    location: { lng: 118.7969, lat: 32.0603 },
    heat: 52300, sentiment: 'negative', sentiment_score: -0.72,
    keywords: ['直播带货', '虚假宣传', '假货', '网红'],
    summary: '某网红主播销售的"进口护肤品"被检测为假货，涉及消费者数千人',
    status: 'active', published_at: new Date(Date.now() - 12600000).toISOString(),
    level: 'medium', category: 'consumer', scope: 'province', province: '江苏省', relatedIds: [1001, 1005, 2005] },
  // === 市级别（信阳及周边） ===
  { id: 3001, title: '信阳市中心交通严重拥堵',
    content: '羊山新区新七大道与新二十四街交叉口因施工围挡和早高峰叠加，严重拥堵持续超2小时。',
    source: '信阳日报', source_url: 'https://xyrb.com/example/3001',
    media_type: 'image', media_urls: ['/images/xinyang_traffic.jpg'],
    city: '信阳市', district: '羊山新区',
    location: { lng: 114.0913, lat: 32.1477 },
    heat: 12500, sentiment: 'negative', sentiment_score: -0.65,
    keywords: ['交通拥堵', '早高峰', '施工', '绕行'],
    summary: '羊山新区新七大道与新二十四街交叉口严重拥堵，持续超2小时',
    status: 'active', published_at: new Date().toISOString(),
    level: 'high', category: 'traffic', scope: 'city', relatedIds: [3005] },
  { id: 3002, title: '信阳供暖管网老化投诉',
    content: '浉河区多个老旧小区居民反映供暖温度不足16度，热力公司称管网老化正在抢修。',
    source: '信阳晚报', source_url: 'https://xywb.com/example/3002',
    media_type: 'text', media_urls: [],
    city: '信阳市', district: '浉河区',
    location: { lng: 114.0813, lat: 32.1377 },
    heat: 8900, sentiment: 'negative', sentiment_score: -0.52,
    keywords: ['供暖', '管网老化', '温度不足', '投诉'],
    summary: '浉河区多个老旧小区居民反映供暖温度不足',
    status: 'active', published_at: new Date(Date.now() - 3600000).toISOString(),
    level: 'medium', category: 'livelihood', scope: 'city', relatedIds: [1002, 2007] },
  { id: 3003, title: '信阳建筑工地农民工讨薪',
    content: '平桥区某建筑项目拖欠30余名农民工工资，总金额约80万元，工人聚集讨薪。',
    source: '本地爆料', source_url: 'https://local.com/example/3003',
    media_type: 'video', media_urls: ['/videos/xinyang_wages.mp4'],
    city: '信阳市', district: '平桥区',
    location: { lng: 114.1013, lat: 32.1577 },
    heat: 15600, sentiment: 'negative', sentiment_score: -0.78,
    keywords: ['讨薪', '农民工', '欠薪', '建筑工地'],
    summary: '平桥区某建筑项目拖欠农民工工资，30余名工人聚集讨薪',
    status: 'active', published_at: new Date(Date.now() - 7200000).toISOString(),
    level: 'high', category: 'livelihood', scope: 'city', relatedIds: [1004] },
  { id: 3004, title: '信阳商场双十二促销纠纷',
    content: '某商场双十二促销活动被消费者质疑"先涨后降"，实际折扣不如宣传。',
    source: '小红书', source_url: 'https://xiaohongshu.com/example/3004',
    media_type: 'image', media_urls: ['/images/xinyang_sale.jpg'],
    city: '信阳市', district: '浉河区',
    location: { lng: 114.0753, lat: 32.1287 },
    heat: 5600, sentiment: 'negative', sentiment_score: -0.42,
    keywords: ['双十二', '促销', '先涨后降', '消费纠纷'],
    summary: '某商场双十二促销活动被指"先涨后降"',
    status: 'active', published_at: new Date(Date.now() - 10800000).toISOString(),
    level: 'low', category: 'consumer', scope: 'city', relatedIds: [1001, 2005] },
  { id: 3005, title: '郑州地铁早高峰故障延误',
    content: '地铁1号线因信号系统故障导致早高峰延误约20分钟，影响数万乘客出行。',
    source: '郑州发布', source_url: 'https://zhengzhou.gov.cn/example/3005',
    media_type: 'text', media_urls: [],
    city: '郑州市', district: '二七区',
    location: { lng: 113.6254, lat: 34.7466 },
    heat: 45600, sentiment: 'negative', sentiment_score: -0.68,
    keywords: ['地铁', '故障', '延误', '早高峰'],
    summary: '地铁1号线信号故障导致早高峰延误20分钟',
    status: 'active', published_at: new Date(Date.now() - 1800000).toISOString(),
    level: 'high', category: 'traffic', scope: 'city', relatedIds: [3001] },
  { id: 3006, title: '武汉医院发热门诊排队过长',
    content: '流感高发期，同济、协和等多家三甲医院发热门诊排队超3小时，医疗资源紧张。',
    source: '长江日报', source_url: 'https://cjrb.com/example/3006',
    media_type: 'text', media_urls: [],
    city: '武汉市', district: '江汉区',
    location: { lng: 114.3055, lat: 30.5928 },
    heat: 38900, sentiment: 'negative', sentiment_score: -0.38,
    keywords: ['发热门诊', '排队', '流感', '医疗资源'],
    summary: '流感高发期，多家三甲医院发热门诊排队超3小时',
    status: 'active', published_at: new Date(Date.now() - 5400000).toISOString(),
    level: 'medium', category: 'health', scope: 'city', relatedIds: [1003] },
  { id: 3007, title: '合肥滑雪场游客受伤事故',
    content: '某滑雪场缆车运行中突发故障，致3名游客受轻伤，景区安全管理和应急处置能力受质疑。',
    source: '合肥晚报', source_url: 'https://hfwb.com/example/3007',
    media_type: 'video', media_urls: ['/videos/hefei_ski.mp4'],
    city: '合肥市', district: '庐阳区',
    location: { lng: 117.2272, lat: 31.8206 },
    heat: 28700, sentiment: 'negative', sentiment_score: -0.62,
    keywords: ['滑雪场', '缆车故障', '游客受伤', '安全'],
    summary: '某滑雪场缆车故障致3名游客受轻伤，景区安全管理引发质疑',
    status: 'active', published_at: new Date(Date.now() - 9000000).toISOString(),
    level: 'high', category: 'safety', scope: 'city', relatedIds: [2004, 2006] },
  { id: 3008, title: '苏州地铁暖心"围巾姐"',
    content: '女乘客在地铁车厢内不慎打翻奶茶，主动用自己的围巾清理地面，暖心举动获全网点赞。',
    source: '苏州发布', source_url: 'https://suzhou.gov.cn/example/3008',
    media_type: 'image', media_urls: ['/images/passenger_found.webp'],
    modelUrl: '/models/squatting_person_compressed.glb',
    city: '苏州市', district: '姑苏区',
    location: { lng: 120.6285, lat: 31.3012 },
    heat: 89000, sentiment: 'positive', sentiment_score: 0.85,
    keywords: ['暖心', '正能量', '文明乘车', '点赞'],
    summary: '女乘客打翻奶茶后用围巾清理地面，获全网点赞',
    status: 'active', published_at: new Date(Date.now() - 172800000).toISOString(),
    level: 'high', category: 'livelihood', scope: 'city', relatedIds: [] }
]

export const sentimentApi = {
  // 获取热点列表 - 支持按地理范围筛选
  getHotspots(params = {}) {
    const { scope, province, city } = params
    let result = demoHotspots
    if (scope === 'national') result = demoHotspots.filter(h => h.scope === 'national')
    else if (scope === 'province' && province) result = demoHotspots.filter(h => h.province === province)
    else if (scope === 'city' && city) result = demoHotspots.filter(h => h.city === city)
    return mockRequest(result)
  },

  // 获取热点详情
  getHotspotDetail(id) {
    const hotspot = demoHotspots.find(h => h.id === id)
    return mockRequest({
      id,
      title: hotspot?.title || '舆情事件详情',
      source: '网络监测',
      time: hotspot?.time || Date.now(),
      content: hotspot?.summary || '暂无详细内容',
      media: [],
      related: []
    })
  },

  // 获取分析数据 - 根据热点动态生成
  getAnalysis(id) {
    const hotspot = demoHotspots.find(h => h.id === id)
    const sentiment = hotspot?.sentiment || { positive: 20, neutral: 30, negative: 50 }
    
    // 根据事件类型生成不同关键词
    const keywordSets = {
      consumer: [
        { name: '双十二', value: 100 }, { name: '虚假宣传', value: 95 },
        { name: '消费维权', value: 88 }, { name: '促销套路', value: 82 },
        { name: '先涨后降', value: 75 }, { name: '退款难', value: 70 },
        { name: '投诉', value: 65 }, { name: '平台监管', value: 60 },
        { name: '直播带货', value: 55 }, { name: '假货', value: 50 }
      ],
      livelihood: [
        { name: '供暖', value: 100 }, { name: '温度不达标', value: 90 },
        { name: '管网老化', value: 85 }, { name: '停暖', value: 80 },
        { name: '老年人', value: 75 }, { name: '投诉', value: 70 },
        { name: '欠薪', value: 65 }, { name: '农民工', value: 60 },
        { name: '讨薪', value: 55 }, { name: '民生', value: 50 }
      ],
      government: [
        { name: '举报', value: 100 }, { name: '公职人员', value: 95 },
        { name: '调查组', value: 90 }, { name: '违纪违规', value: 85 },
        { name: '追责', value: 80 }, { name: '纪委监委', value: 75 },
        { name: '通报', value: 70 }, { name: '官商勾结', value: 65 },
        { name: '国有资产', value: 60 }, { name: '失信企业', value: 55 }
      ],
      traffic: [
        { name: '拥堵', value: 100 }, { name: '交通', value: 90 },
        { name: '地铁', value: 85 }, { name: '故障', value: 80 },
        { name: '延误', value: 75 }, { name: '高峰期', value: 70 },
        { name: '疏导', value: 65 }, { name: '绕行', value: 60 },
        { name: '信号灯', value: 55 }, { name: '施工', value: 50 }
      ],
      health: [
        { name: '流感', value: 100 }, { name: '发热门诊', value: 95 },
        { name: '排队', value: 90 }, { name: '医疗资源', value: 85 },
        { name: '疫情', value: 80 }, { name: '防控', value: 75 },
        { name: '医院', value: 70 }, { name: '药品', value: 65 },
        { name: '床位', value: 60 }, { name: '接种', value: 55 }
      ],
      safety: [
        { name: '火情', value: 100 }, { name: '事故', value: 95 },
        { name: '安全', value: 90 }, { name: '伤亡', value: 85 },
        { name: '消防', value: 80 }, { name: '救援', value: 75 },
        { name: '爆炸', value: 70 }, { name: '电动车', value: 65 },
        { name: '缆车', value: 60 }, { name: '景区', value: 55 }
      ]
    }
    
    const category = hotspot?.category || 'livelihood'
    const keywords = keywordSets[category] || keywordSets.livelihood
    
    return mockRequest({
      hotspotId: id,
      sentimentScore: (sentiment.positive / 100).toFixed(2),
      emotion: { negative: sentiment.negative, neutral: sentiment.neutral, positive: sentiment.positive },
      keywords,
      trends: {
        dates: ['12/5', '12/6', '12/7', '12/8', '12/9', '12/10', '12/11'],
        historical: [15, 25, 40, 65, hotspot?.heat ? Math.round(hotspot.heat / 1000) : 50, null, null],
        prediction: [null, null, null, null, hotspot?.heat ? Math.round(hotspot.heat / 1000) : 50, 
                     hotspot?.heat ? Math.round(hotspot.heat / 1200) : 40, 
                     hotspot?.heat ? Math.round(hotspot.heat / 1500) : 30]
      }
    })
  },

  // 创建热点
  createHotspot(data) {
    return mockRequest({
      id: Date.now(),
      ...data,
      time: Date.now()
    })
  },

  // 更新热点
  updateHotspot(id, data) {
    return mockRequest({
      id,
      ...data,
      updatedAt: Date.now()
    })
  },

  // 删除热点
  deleteHotspot(id) {
    return mockRequest({ success: true, id })
  },

  // 获取事件列表 - 基于模拟舆情生成
  getEvents() {
    return mockRequest([
      { id: 1001, title: '双十二消费维权舆情', level: 'high', status: 'processing',
        time: Date.now(), description: '多地消费者投诉虚假宣传', assignee: '市场监管总局' },
      { id: 2001, title: '湖南郴州举报事件', level: 'high', status: 'pending',
        time: Date.now(), description: '店主举报公职人员违纪', assignee: '纪委监委' },
      { id: 2004, title: '广州街头火情', level: 'high', status: 'resolved',
        time: Date.now() - 1800000, description: '车辆碰撞起火已扑灭', assignee: '消防救援局' },
      { id: 3001, title: '信阳交通拥堵', level: 'high', status: 'processing',
        time: Date.now(), description: '羊山新区主干道严重拥堵', assignee: '交警支队' },
      { id: 3003, title: '信阳农民工讨薪', level: 'high', status: 'pending',
        time: Date.now() - 7200000, description: '平桥区建筑项目欠薪', assignee: '劳动监察大队' },
      { id: 1003, title: '流感疫情监测', level: 'medium', status: 'processing',
        time: Date.now() - 7200000, description: '医疗资源紧张情况跟踪', assignee: '卫健委' }
    ])
  },

  // 更新事件状态
  updateEventStatus(id, status) {
    return mockRequest({ success: true, id, status })
  },

  // 获取事件时间轴
  getEventTimeline(id) {
    return mockRequest([
      { time: Date.now() - 1000000, content: '事件上报', type: 'primary' },
      { time: Date.now() - 800000, content: '系统自动分派', type: 'info' },
      { time: Date.now() - 500000, content: '处理人员已接单', type: 'warning' }
    ])
  }
}
