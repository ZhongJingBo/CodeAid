import { mock } from "../../mock/tab.js";
import { isExtensionEnvironment } from "@utils/environment.js";
import React, { useState, useEffect } from "react";
import Proxy from "./compoents/proxy/index.jsx";
import RequestForwardService from "@/services/RequestForwardService";
import { FORWARD_RULE_KEY } from "../../constants";

/**
 * 从 chrome storage 异步获取转发规则
 * @returns {Promise<Object>} 转发规则对象
 * @throws {Error} 如果出现错误
 */
export const getForwardRules = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(FORWARD_RULE_KEY, (result) => {
        resolve(result?.[FORWARD_RULE_KEY] || {});
      });
    } catch (error) {
      reject(new Error(`获取转发规则失败: ${error.message}`));
    }
  });
};

/**
 * 获取存储的数据
 * @returns {Promise<Object>} 转发规则数据
 * @throws {Error} 如果不是插件环境或获取失败
 */
export const getData = async () => {
  if (!isExtensionEnvironment()) {
    throw new Error("未处于浏览器插件环境");
  }

  try {
    return await getForwardRules();
  } catch (error) {
    throw new Error(`获取转发规则失败: ${error.message}`);
  }
};

/**
 * 更新转发规则数据
 * @param {Object} data - 要更新的数据
 * @param {string} key - 数据的键名
 * @returns {Promise<void>}
 * @throws {Error} 如果更新失败
 */
export const updateData = async (data) => {
  if (!isExtensionEnvironment()) {
    throw new Error("未处于浏览器插件环境");
  }

  try {
    const key = Object.keys(data)[0];
    const oldRuleData = await getForwardRules();
    await chrome.storage.local.set({
      [FORWARD_RULE_KEY]: {
        ...oldRuleData,
        [key]: data[key],
      },
    });

    await updateChromeRules(data, key);
  } catch (error) {
    throw new Error(`更新转发规则失败: ${error.message}`);
  }
};

/**
 * 从编辑器更新数据
 * @param {Object} data - 要更新的数据
 * @param {string} key - 分组键名
 * @returns {Promise<void>}
 * @throws {Error} 如果更新失败
 */
export const editorUpdateData = async (data, group) => {
  if (!isExtensionEnvironment()) {
    throw new Error("未处于浏览器插件环境");
  }

  try {
    const oldRuleData = await getForwardRules();

    // 创建更新对象
    const updatedGroup = {
      ...oldRuleData[group],
      ...data,
    };
    await chrome.storage.local.set({
      [FORWARD_RULE_KEY]: {
        ...oldRuleData,
        [group]: updatedGroup,
      },
    });
    await updateChromeRules({ [group]: updatedGroup }, group);
  } catch (error) {
    throw new Error(`编辑器更新数据失败: ${error.message}`);
  }
};

/**
 * 删除转发规则
 * @param {string} key - 要删除的规则键名
 * @returns {Promise<void>}
 * @throws {Error} 如果删除失败
 */
export const deleteData = async (key) => {
  if (!isExtensionEnvironment()) {
    throw new Error("未处于浏览器插件环境");
  }

  try {
    const oldRuleData = await getForwardRules();
    const newRuleData = { ...oldRuleData };
    delete newRuleData[key];

    await chrome.storage.local.set({
      [FORWARD_RULE_KEY]: newRuleData,
    });

    await updateChromeRules({ [key]: { rule: [] } }, key);
  } catch (error) {
    throw new Error(`删除转发规则失败: ${error.message}`);
  }
};

/**
 * 初始化数据
 * @returns {Promise<boolean>} 是否初始化成功
 */
export const initData = async () => {
  if (!isExtensionEnvironment()) {
    return false;
  }

  try {
    const result = await chrome.storage.local.get(FORWARD_RULE_KEY);

    if (
      !result?.[FORWARD_RULE_KEY] ||
      Object.keys(result[FORWARD_RULE_KEY]).length === 0
    ) {
      await chrome.storage.local.set({ [FORWARD_RULE_KEY]: mock });
    }

    return true;
  } catch (error) {
    console.error("初始化数据失败:", error);
    return false;
  }
};

/**
 * 更新 Chrome 规则
 * @param {Object} data - 规则数据
 * @param {string} key - 数据键名
 * @returns {Promise<void>}
 */
export const updateChromeRules = async (data, key) => {
  try {
    const { rule } = data[key];
    const result = [];

    const storeRules = await getForwardRules();
    const newData = { ...storeRules, ...data };

    // 遍历所有规则组,收集启用的规则
    for (let groupKey in newData) {
      if (newData[groupKey].groupEnabled && newData[groupKey].rule) {
        result.push(...newData[groupKey].rule);
      }
    }

    await RequestForwardService.updateChromeRules(result);
  } catch (error) {
    throw new Error(`更新 Chrome 规则失败: ${error.message}`);
  }
};

/**
 * 更新jsonc 更新items
 */
