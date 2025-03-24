import { FORWARD_RULE_KEY } from '../constants';

// 使用 declarativeNetRequest 替代 webRequest



chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});


chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  console.log(e, 'rule matched');
});


const updateRules = async () => {
  const rules = await chrome.storage.local.get([FORWARD_RULE_KEY]);
  const forwardRules = rules[FORWARD_RULE_KEY] || [];
  
  // 转换规则格式
  const declarativeRules = forwardRules
    .filter(rule => rule.enabled)
    .map((rule, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: rule.target
        }
      },
      condition: {
        regexFilter: rule.pattern,
        resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
      }
    }));

  // 更新规则
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: declarativeRules.map(rule => rule.id),
    addRules: declarativeRules
  });
}

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes[FORWARD_RULE_KEY]) {
    updateRules();
  }
});

// // 点击扩展图标时打开侧边栏
// chrome.action.onClicked.addListener(async (tab) => {
//   // 打开侧边栏
//   console.log('点击扩展图标')
//   await chrome.sidePanel.open({ windowId: tab.windowId });
// });

// // 确保侧边栏默认打开
// chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });




// 初始化规则
updateRules();