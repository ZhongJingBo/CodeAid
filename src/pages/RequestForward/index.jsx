import React, { useState, useEffect } from "react";
import { Input } from "antd";
import Tabs from "../../components/Tabs";
import Proxy from "./compoents/proxy";
import {
  getForwardRules,
  getData,
  updateData,
  initData,
  deleteData,
} from "./service";
import "./index.less";
import { isExtensionEnvironment } from "@utils/environment.js";
// 初始化数据
initData();

const RequestForward = () => {
  const [items, setItems] = useState([]);
  const [isEnabled, setIsEnabled] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  // 加载数据
  const loadData = async () => {
    const data = await getData();
    initTabState(data);
  };

  // 初始化tab状态
  const initTabState = (data) => {
    const items = Object.entries(data).map(([key, value]) => {
      const item = {
        key: key,
        label: key,
        groupEnabled: value.groupEnabled,
        rule: value.rule,
        children: (
          <Proxy
            group={value.key}
            type={value.key}
            rule={value.rule}
            groupEnabled={value.groupEnabled}
            updateData={(data) => {
              proxyUpdata(data, items);
            }}
          />
        ),
      };
      return item;
    });
    setItems(items);
    const enabledState = items.reduce((acc, item) => {
      acc[item.key] = item.groupEnabled;
      return acc;
    }, {});
    setIsEnabled(enabledState);
  };

  const proxyUpdata = (data, items) => {
    const newItems = [...items];
    const key = Object.keys(data)[0];
    newItems.forEach((item, index) => {
      if (item.key === key) {
        newItems[index] = {
          ...newItems[index],
          ...data[key],
        };
      }
    });

    setItems(newItems);
    updateData(data);
    // 更新items
  };

  // 切换当前tab启用状态
  const onSwitch = (item) => {
    const { key } = item;
    const newEnabledState = !isEnabled[key];

    setIsEnabled((prev) => ({
      ...prev,
      [key]: newEnabledState,
    }));

    const targetItem = items.find((value) => value.key === key);
    if (targetItem) {
      const updatedData = {
        [key]: {
          key: targetItem.key,
          label: targetItem.key,
          rule: targetItem.rule,
          groupEnabled: newEnabledState,
        },
      };
      updateData(updatedData);
    }
  };

  // 添加tab
  const handleTabAdd = (value) => {
    const defaultKey = `tab${items.length + 1}`;

    if (value) {
      const newTab = {
        key: value,
        label: value,
        groupEnabled: true,
        rule: [],
        children: (
          <Proxy
            group={value}
            type={value}
            rule={[]}
            groupEnabled={true}
            updateData={updateData}
          />
        ),
      };

      setItems([...items, newTab]);
      updateData({
        [value]: {
          key: value,
          groupEnabled: true,
          rule: [],
        },
      });
    }
  };

  // 删除tab
  const handleTabRemove = async (key) => {
    await deleteData(key);
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <div className="request-forward-container">
      <Tabs
        items={items}
        onTabAdd={handleTabAdd}
        onTabRemove={handleTabRemove}
        onTabChange={(key) => console.log("Tab changed:", key)}
        onSwitch={onSwitch}
        isEnabled={isEnabled}
      />
    </div>
  );
};

export default RequestForward;

/**
 * TODO:
 * 1. 关闭tab时自动删除分组并更新定位
 * 2. 添加一键关闭所有代理的按钮(代理icon上)
 * 3. 添加切换模式的按钮
 */
