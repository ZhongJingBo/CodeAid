import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useInputClickOutside } from "@hooks/useInputClickOutside";
import "./index.less";

const Tabs = ({
  defaultActiveKey,
  items,
  onTabChange,
  onTabAdd,
  onTabRemove,
  addable = true,
  removable = true,
  editable = true,
  primaryColor,
  onSwitch,
  isEnabled,
}) => {
  const [activeKey, setActiveKey] = useState(
    defaultActiveKey || items[0]?.key || ""
  );
  const [isAddInput, setIsAddInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useInputClickOutside(() => {
    setIsAddInput(false);
  });
  useEffect(() => {
    setActiveKey(items[0]?.key);
  }, [items[0]?.key]);

  const handleTabClick = (key) => {
    setActiveKey(key);
    onTabChange?.(key);
  };

  const handleTabAdd = () => {
    setIsAddInput(true);
    if (isAddInput && inputValue) {
      onTabAdd?.(inputValue);
      setIsAddInput(false);
      setInputValue("");
    }
  };

  const handleTabRemove = (e, key) => {
    e.stopPropagation();
    if (items.length <= 1 || key === items[0].key) return;
    onTabRemove?.(key);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="custom-tabs">
      <div className="tabs-header">
        <div className="tabs-list">
          {items.map((item, index) => (
            <div
              key={item.key}
              className={`tab ${activeKey === item.key ? "active" : ""}`}
              onClick={() => handleTabClick(item.key)}
              onDoubleClick={() => {
                onSwitch(item);
              }}
            >
              <span className="tab-title">{item.label}</span>
              {isEnabled[item.key] && <span className="circle"></span>}

              {removable && index !== 0 && (
                <span
                  className="tab-close"
                  onClick={(e) => handleTabRemove(e, item.key)}
                >
                  ×
                </span>
              )}
            </div>
          ))}
        </div>
        {isAddInput && (
          <div className="input-warpper">
            <Input
              ref={dropdownRef}
              type="text"
              placeholder="请输入标签名称"
              width="120px"
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              value={inputValue}
              onBlur={() => {
                handleTabAdd();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTabAdd();
                }
              }}
            />
          </div>
        )}
        {addable && (
          <div className="add-tab" onClick={handleTabAdd}>
            +
          </div>
        )}
      </div>
      <div className="tabs-content">
        {items.map((item) => (
          <div
            key={item.key}
            className={`tab-pane ${activeKey === item.key ? "active" : ""}`}
          >
            {item.children}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
