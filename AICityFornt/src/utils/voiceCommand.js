/**
 * 语音指令解析模块
 * 解析语音转文字结果，映射到系统操作
 */

// 城市映射表
const CITY_MAP = {
  '上海': 'shanghai',
  '北京': 'beijing',
  '深圳': 'shenzhen',
  '信阳': 'xinyang',
  '信阳市': 'xinyang'
};

// 等级映射表
const LEVEL_MAP = {
  '高风险': 'high',
  '中风险': 'medium',
  '低风险': 'low',
  '高热度': 'high',
  '中热度': 'medium',
  '低热度': 'low',
  '紧急': 'high'
};

/**
 * 解析语音指令
 * @param {string} text - 语音转写的文本
 * @returns {Object|null} - 解析出的指令对象，格式: { type: string, payload: any }
 */
export const parseCommand = (text) => {
  if (!text) return null;
  
  const cleanText = text.trim().toLowerCase();
  
  // 1. 切换城市指令
  // 模式: "切换到[城市]", "查看[城市]"
  const cityMatch = cleanText.match(/(?:切换到|查看|定位到)(.+)/);
  if (cityMatch) {
    const cityRaw = cityMatch[1].replace('市', '').trim();
    // 尝试直接匹配或模糊匹配
    const cityKey = Object.keys(CITY_MAP).find(k => k.includes(cityRaw) || cityRaw.includes(k));
    
    if (cityKey) {
      return {
        type: 'SWITCH_CITY',
        payload: CITY_MAP[cityKey]
      };
    }
  }
  
  // 2. 筛选舆情指令
  // 模式: "显示[级别]舆情", "只看[级别]"
  const filterMatch = cleanText.match(/(?:显示|只看|筛选)(.+)(?:舆情|风险|事件)/);
  if (filterMatch) {
    const levelRaw = filterMatch[1].trim();
    const levelKey = Object.keys(LEVEL_MAP).find(k => levelRaw.includes(k));
    
    if (levelKey) {
      return {
        type: 'FILTER_LEVEL',
        payload: LEVEL_MAP[levelKey]
      };
    }
  }
  
  // 3. 功能切换指令
  if (cleanText.includes('热力图')) {
    if (cleanText.includes('开启') || cleanText.includes('显示') || cleanText.includes('打开')) {
      return { type: 'TOGGLE_LAYER', payload: { layer: 'heatmap', visible: true } };
    }
    if (cleanText.includes('关闭') || cleanText.includes('隐藏')) {
      return { type: 'TOGGLE_LAYER', payload: { layer: 'heatmap', visible: false } };
    }
  }
  
  // 4. 播报/帮助
  if (cleanText.includes('播报') || cleanText.includes('朗读')) {
    return { type: 'SPEAK_SUMMARY', payload: null };
  }
  
  return {
    type: 'UNKNOWN',
    payload: text
  };
};

/**
 * 执行指令
 * @param {Object} command - 指令对象
 * @param {Object} stores - 相关的 Pinia stores { mapStore, sentimentStore, voiceStore }
 */
export const executeCommand = (command, stores) => {
  if (!command || !stores) return;
  
  const { mapStore, sentimentStore, voiceStore } = stores;
  
  switch (command.type) {
    case 'SWITCH_CITY':
      console.log(`[Command] Switching city to ${command.payload}`);
      // 假设 mapStore 有 setCity 方法，或者通过事件总线
      // 这里我们需要触发 Map 组件的更新，通常通过 Store 状态
      // mapStore.setCity(command.payload); // 需要确认 mapStore 实现
      // 暂时通过 window 事件模拟，或者如果 store 支持
      window.dispatchEvent(new CustomEvent('switch-city', { detail: { city: command.payload } }));
      voiceStore.speak(`好的，正在为您切换到${command.payload === 'xinyang' ? '信阳' : '该城市'}`);
      break;
      
    case 'FILTER_LEVEL':
      console.log(`[Command] Filtering level: ${command.payload}`);
      sentimentStore.updateFilters({ level: command.payload });
      voiceStore.speak(`已筛选${command.payload === 'high' ? '高风险' : '相关'}舆情`);
      break;
      
    case 'TOGGLE_LAYER':
      console.log(`[Command] Toggle layer: ${command.payload.layer} = ${command.payload.visible}`);
      if (mapStore.layers[command.payload.layer] !== command.payload.visible) {
        mapStore.toggleLayer(command.payload.layer);
      }
      voiceStore.speak(`已${command.payload.visible ? '开启' : '关闭'}热力图`);
      break;
      
    case 'SPEAK_SUMMARY':
      const summary = `当前监控到${sentimentStore.hotspots.length}条舆情事件，其中高风险事件${sentimentStore.highPriorityCount}条。`;
      voiceStore.speak(summary);
      break;
      
    default:
      console.warn('[Command] Unknown command:', command);
      // voiceStore.speak('抱歉，我没听清您的指令');
  }
};
