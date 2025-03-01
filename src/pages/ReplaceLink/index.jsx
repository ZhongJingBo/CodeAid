import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, message } from "antd";
import NotesPopover from "./components/NotesPopover";
import "./index.less";
import { getMockCurrentUrl } from "@/mock/data";

const ReplaceLink = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [queryParams, setQueryParams] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [displayAddParamesInput, setDisplayAddParamesInput] = useState(false);
  const [newParam, setNewParam] = useState({ key: "", value: "" });
  const [isAddNotes, setIsAddNotes] = useState(false);
  const [activePopover, setActivePopover] = useState(null);

  const parseQueryString = (url) => {
    try {
      const urlParts = url.split("?");
      const queryString = urlParts[1];
      setBaseUrl(urlParts[0]);

      if (!queryString) return [];

      return queryString.split("&").map((pair) => {
        const [key, value] = pair.split("=");
        return {
          [decodeURIComponent(key)]: decodeURIComponent(value || ""),
        };
      });
    } catch (error) {
      console.error("Error parsing query string:", error);
      return [];
    }
  };

  const updateUrlInfo = (url) => {
    setCurrentUrl(url);
    const params = parseQueryString(url);
    setQueryParams(params);
  };

  useEffect(() => {
    // 开发模式使用 mock 数据
    if (process.env.NODE_ENV === "development") {
      const mockUrl = getMockCurrentUrl();
      updateUrlInfo(mockUrl);
      return;
    }

    // 生产环境使用真实的 Chrome API
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          updateUrlInfo(tabs[0].url);
        }
      });

      // 监听标签页更新事件
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        // 确保是当前活动的标签页
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id === tabId && changeInfo.url) {
            updateUrlInfo(changeInfo.url);
          }
        });
      });

      // 监听标签页激活事件
      chrome.tabs.onActivated.addListener((activeInfo) => {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
          if (tab.url) {
            updateUrlInfo(tab.url);
          }
        });
      });
    }

    // 清理监听器
    return () => {
      if (chrome?.tabs) {
        chrome.tabs.onUpdated.removeListener();
        chrome.tabs.onActivated.removeListener();
      }
    };
  }, []);

  const handleSubmit = () => {
    setDisplayAddParamesInput(false);
    const newParams = queryParams
      .map((param) => {
        const [key, value] = Object.entries(param)[0];
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");

    const newUrl = `${baseUrl}?${newParams}`;
    chrome.tabs.update({ url: newUrl });
  };

  const handleAddParam = () => {
    setQueryParams([...queryParams, { [newParam.key]: newParam.value }]);
    setNewParam({ key: "", value: "" });
    setDisplayAddParamesInput(false);
  };

  const handleCopyQueryParams = () => {
    try {
      if (queryParams.length === 0) {
        message.warning("查询参数为空");
        return;
      }

      const paramsObject = queryParams.reduce((acc, param) => {
        const [key, value] = Object.entries(param)[0];
        acc[key] = value;
        return acc;
      }, {});

      const jsonString = JSON.stringify(paramsObject, null, 2);

      navigator.clipboard.writeText(jsonString).then(() => {
        message.success("查询参数已复制为JSON");
      });
    } catch (err) {
      message.error("复制查询参数失败");
      console.error("复制失败:", err);
    }
  };

  const handlePopoverVisibleChange = (index, visible) => {
    setActivePopover(visible ? index : null);
  };

  return (
    <div className="replace-link-container">
      <div className="url-display">
        <h2
          onClick={() => {
            navigator.clipboard
              .writeText(baseUrl)
              .then(() => {
                message.success("Base URL copied to clipboard");
              })
              .catch((err) => {
                message.error("Failed to copy");
                console.error("Failed to copy:", err);
              });
          }}
          style={{ cursor: "pointer" }}
        >
          baseUrl: {baseUrl}
        </h2>
        <div>
          <Button
            onClick={() => {
              if (isAddNotes) {
                setIsAddNotes(false);
              } else {
                setIsAddNotes(true);
              }
            }}
          >
            {" "}
            {isAddNotes ? "Hide Notes" : "Add Notes"}
          </Button>
        </div>
      </div>

      <div className="query-params-display">
        <h3 onClick={handleCopyQueryParams} style={{ cursor: "pointer" }}>
          queryParams:
        </h3>

        <div className="params-list">
          {queryParams.map((item, index) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <div key={index} className="param-item">
                <span className="param-label">{key}</span>
                <div className="param-input-wrapper">
                  <Input
                    value={value}
                    style={{ width: "300px" }}
                    onFocus={() => setDisplayAddParamesInput(false)}
                    onChange={(e) => {
                      const newQueryParams = [...queryParams];
                      newQueryParams[index] = { [key]: e.target.value };
                      setQueryParams(newQueryParams);
                    }}
                  />
                  {isAddNotes && (
                    <NotesPopover
                      paramKey={key}
                      paramValue={value}
                      onValueChange={(newValue) => {
                        const newQueryParams = [...queryParams];
                        newQueryParams[index] = { [key]: newValue };
                        setQueryParams(newQueryParams);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {displayAddParamesInput && (
         
              <Row>
                <Col span={4}>
                  <div className="key-input-wrapper">
                    <Input
                      placeholder="key"
                      value={newParam.key}
                      onChange={(e) =>
                        setNewParam({ ...newParam, key: e.target.value })
                      }
                    />
                  </div>
                </Col>
                <Col span={20}>
                  <Input
                    className="value-input"
                    placeholder="value"
                    value={newParam.value}
                    onChange={(e) =>
                      setNewParam({ ...newParam, value: e.target.value })
                    }
                  />
                  <Button
                    type="primary"
                    className="add-param-btn"
                    onClick={handleAddParam}
                  >
                    add
                  </Button>
                </Col>
              </Row>
         
          )}

          <div className="form-footer">
            <div>
              <Button
                onClick={() => {
                  setDisplayAddParamesInput(true);
                }}
                style={{ marginRight: "10px" }}
              >
                Add Param
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplaceLink;
