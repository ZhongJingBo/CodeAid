// 设置侧边栏行为
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// // 存储拦截的请求记录
// let interceptedRequests = [];

// // 更新动态规则
// async function updateProxyRules() {
//   // 获取存储的代理规则
//   const { proxyRules = [] } = await chrome.storage.local.get(['proxyRules']);
  
//   // 构建声明式规则
//   const dynamicRules = proxyRules
//     .filter(rule => rule.enabled)
//     .map((rule, index) => ({
//       id: index + 1,
//       priority: 1,
//       action: {
//         type: 'modifyHeaders',
//         requestHeaders: [
//           {
//             header: 'Host',
//             operation: 'set',
//             value: new URL(rule.target).host
//           }
//         ]
//       },
//       condition: {
//         urlFilter: rule.pattern,
//         resourceTypes: [
//           'main_frame',
//           'sub_frame', 
//           'stylesheet',
//           'script',
//           'image',
//           'font',
//           'object',
//           'xmlhttprequest',
//           'ping',
//           'media',
//           'websocket',
//           'other'
//         ]
//       }
//     }));

//   // 更新动态规则
//   try {
//     await chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: dynamicRules.map(rule => rule.id), // 移除旧规则
//       addRules: dynamicRules // 添加新规则
//     });
//     console.log('代理规则更新成功:', dynamicRules);
//   } catch (error) {
//     console.error('更新代理规则失败:', error);
//   }
// }

// // 监听存储变化,更新规则
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   if (namespace === 'local' && changes.proxyRules) {
//     console.log('代理规则变更:', changes.proxyRules.newValue);
//     updateProxyRules();
//   }
// });

// // 初始化时更新规则
// updateProxyRules();