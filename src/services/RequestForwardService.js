import { FORWARD_RULE_KEY } from '../constants';

class RequestForwardService {
  static transformToDeclarativeRules(forwardRules) {
    return forwardRules
      .filter((rule) => rule.enabled)
      .map((rule, index) => ({
        id: index + 1,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            regexSubstitution: rule.target,
          },
        },
        condition: {
          regexFilter: rule.pattern,
          resourceTypes: [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "xmlhttprequest",
            "other",
          ],
        },
      }));
  }

  // 更新 Chrome 的重定向规则
  static async updateChromeRules(forwardRules) {
    try {
      // 获取现有规则
      const existingRules =
        await chrome.declarativeNetRequest?.getDynamicRules();

      const existingRuleIds = existingRules.map((rule) => rule.id);
      // 转换新规则
      const newRules = this.transformToDeclarativeRules(forwardRules);

      const customEvent = new CustomEvent("chromeRules-update", {
        detail: { ruleCount: newRules?.length },
      });
      document.dispatchEvent(customEvent);
      // 更新规则
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: newRules,
      });

      console.log("Chrome rules updated:", newRules);
      return true;
    } catch (error) {
      console.error("Failed to update Chrome rules:", error);
      return false;
    }
  }

  // 获取当前规则数量
  static async getRulesCount() {
    try {
      const rules = await chrome.declarativeNetRequest?.getDynamicRules();
      return rules.length;
    } catch (error) {
      console.error("Failed to get rules count:", error);
      return 0;
    }
  }

  // 初始化所有规则
  static async initChromeRules() {
    const result = [];
    const storeRules = await chrome.storage.local.get(FORWARD_RULE_KEY);
    const { [FORWARD_RULE_KEY]: forwardRules } = storeRules || {};
    const customEvent = new CustomEvent("chromeRules-update", {
      detail: { ruleCount: result?.length },
    });

    for (let key in forwardRules) {
      if (forwardRules[key].groupEnabled && forwardRules[key].rule) {
        result.push(...forwardRules[key].rule);
      }
    }

    document.dispatchEvent(customEvent);
    console.log(result ,'result')
    await this.updateChromeRules(result);
  }

  // 取消所有代理规则
  static async removeAllRules() {
    try {
      // 获取所有现有规则
      const existingRules =
        await chrome.declarativeNetRequest.getDynamicRules();
      const existingRuleIds = existingRules.map((rule) => rule.id);

      // 移除所有规则
      if (existingRuleIds.length > 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: existingRuleIds,
          addRules: [],
        });
        console.log("All proxy rules removed successfully");
      }
      return true;
    } catch (error) {
      console.error("Failed to remove all rules:", error);
      return false;
    }
  }
}

export default RequestForwardService;
