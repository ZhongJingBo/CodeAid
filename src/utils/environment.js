/**
 * 判断当前是否在浏览器扩展环境中运行
 * @returns {boolean} 是否在扩展环境中
 */
export const isExtensionEnvironment = () => {
    // 检查 chrome.runtime
    const isChromeExtension = typeof chrome !== 'undefined' && 
      chrome.runtime && 
      chrome.runtime.id;
  
    // 检查 browser.runtime (Firefox)
    const isFirefoxExtension = typeof browser !== 'undefined' && 
      browser.runtime && 
      browser.runtime.id;
  
    return Boolean(isChromeExtension || isFirefoxExtension);
  };
  
  /**
   * 获取当前扩展环境类型
   * @returns {'chrome' | 'firefox' | 'other' | null} 扩展环境类型
   */
  export const getExtensionType = () => {
    if (!isExtensionEnvironment()) {
      return null;
    }
  
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      return 'chrome';
    }
  
    if (typeof browser !== 'undefined' && browser.runtime) {
      return 'firefox';
    }
  
    return 'other';
  };



  /**
 * 去除对象中所有字符串值的前后空格
 * @param {Object} obj - 需要处理的对象
 * @returns {Object} - 处理后的新对象
 */
export const trimObjectValues = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    acc[key] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {});
};
