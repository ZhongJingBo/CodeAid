import axios from "axios";

/**
 * 请求 Kimi API 获取生成的内容
 * @param {string} apiURL - API 的 URL 地址
 * @param {string} apiKey - API 密钥
 * @param {string} documentation - 文档内容
 * @param {string} requestJSON - 请求的 JSON 结构
 * @returns {Promise} - 返回 API 请求的 Promise
 */
export const requestKimi = (apiURL, apiKey, documentation, requestJSON) => {
  // 验证必要参数
  if (!apiURL || !apiKey) {
    return Promise.reject(new Error('API URL 和 API Key 不能为空'));
  }

  const data = {
    model: "moonshot-v1-8k",
    messages: [
      {
        role: "user",
        content: `请基于${documentation || ''} ,生成${requestJSON || ''}结构 ,且只返回json结构数据`,
      },
    ],
  };

  return axios.post(apiURL, data, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 30000, // 30秒超时
  }).catch(error => {
    console.error('Kimi API 请求失败:', error);
    throw error;
  });
};

/**
 * 请求获取 HTML 内容
 * @param {string} url - 要请求的 URL
 * @returns {Promise} - 返回 axios 请求的 Promise
 */
export const requestHtml = (url) => {
  if (!url) {
    return Promise.reject(new Error('URL 不能为空'));
  }
  
  return axios.get(url, {
    timeout: 10000, // 10秒超时
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'User-Agent': 'Mozilla/5.0 (compatible; CodeAid/1.0)'
    }
  }).catch(error => {
    console.error('HTML 请求失败:', error);
    throw error;
  });
};

/**
 * 表单记忆功能 Action 流程:
 * 1. 点击 add - 若未提交，显示提示信息并阻止后续执行
 * 2. 点击后记录页面 URL 和当前点击的 key
 * 3. 点击 update - 若未提交，显示提示信息并阻止后续执行
 * 4. 在有 queryParams 的 input 后判断是否有存储的 key:
 *    - 有: 显示向下箭头按钮
 *    - 没有: 显示 ➕ 按钮
 * 5. 点击 ➕ 按钮后显示 tooltip，包含 input、备注、当前 key 和 value 以及确认按钮
 * 6. 确认后将数据存储到本地，默认备注为空
 * 7. 点击向下箭头按钮后显示 tooltip，包含备注、存储的 key 和 value 以及替换按钮
 */

/**
 * 从存储中获取表单记忆数据
 * @param {string} key - 数据的键名
 * @returns {Promise} - 包含数据的 Promise
 */
export const getFormMemory = (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] || null);
    });
  });
};

/**
 * 将表单记忆数据保存到存储中
 * @param {string} key - 数据的键名
 * @param {object} data - 要保存的数据
 * @returns {Promise} - 操作的 Promise
 */
export const saveFormMemory = (key, data) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: data }, resolve);
  });
};

// fetch 请求语雀 获取dom