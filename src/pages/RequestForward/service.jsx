import { mock } from "../../mock/tab.js";
import { isExtensionEnvironment } from "@utils/environment.js";
import React, { useState, useEffect } from "react";
import Proxy from "./compoents/proxy/index.jsx";
import RequestForwardService from "@/services/RequestForwardService";
/**
 * 获取stroe数据
 */
export const getData = async () => {
  if (isExtensionEnvironment()) {
    try {
      return await getForwardRules();
    } catch (error) {
      throw new Error(`获取转发规则失败: ${error.message}`);
    }
  }
  throw new Error("未处于浏览器插件环境");
};

/**
 * 更新数据
 */
export const updateData = async (data) => {
  const key = Object.keys(data)[0];
  if (isExtensionEnvironment()) {
    const oldRuleData = await getForwardRules();
    await chrome.storage.local.set({
      forwardRules: {
        ...oldRuleData,
        [key]: data[key],
      },
    });

    updateChromeRules(data, key);
  }
};

/**
 * 删除
 */
export const deleteData = async (key) => {
  if (isExtensionEnvironment()) {
    const oldRuleData = await getForwardRules();
    const newRuleData = { ...oldRuleData };
    delete newRuleData[key];

    await chrome.storage.local.set({
      forwardRules: newRuleData,
    });

    updateChromeRules({ [key]: { rule: [] } }, key);
  }
};

/**
 * 从 chrome storage 异步获取转发规则
 * @returns {Promise<Array>} 转发规则数组
 */
export const getForwardRules = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get("forwardRules", (result) => {
        resolve(result?.forwardRules || {});
      });
    } catch (error) {
      reject(error);
    }
  });
};

// 初始化数据
export const initData = async () => {
  try {
    const result = await chrome.storage.local.get("forwardRules");

    if (
      !result?.forwardRules ||
      Object.keys(result.forwardRules).length === 0
    ) {
      await chrome.storage.local.set({ forwardRules: mock });
    }
    return true;
  } catch (error) {
    console.error("Failed to initialize data:", error);
    return false;
  }
};

/**
 * 更新代理规则数据
 */

export const updateChromeRules = async (data, key) => {
  const { rule } = data[key];
  const result = [];

  const storeRules = await getForwardRules();

  const newData = { ...storeRules, ...data };

  // 遍历所有规则组,收集启用的规则
  for (let key in newData) {
    if (newData[key].groupEnabled && newData[key].rule) {
      result.push(...newData[key].rule);
    }
  }

  await RequestForwardService.updateChromeRules(result);
};
