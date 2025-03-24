import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./sideBar.css";
import {
  PaperClipOutlined,
  EditOutlined,
  TranslationOutlined,
  ScanOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  MoreOutlined,
  SwapOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import RequestForwardService from '../../services/RequestForwardService'
const SideBar = () => {
  const history = useHistory();
  const location = useLocation();
  const [ruleCount, setRuleCount] = useState("");

  useEffect(() => {
    chrome.declarativeNetRequest?.getDynamicRules().then((res) => {
      setRuleCount(res?.length || 0);
    });

    document.addEventListener("chromeRules-update", function (event) {
      setRuleCount(event.detail.ruleCount || 0);
    });
  }, []);

  const menuItems = [
    { icon: <PaperClipOutlined />, label: "链接", path: "/", key: "/" },
    {
      key: "/request-forward",
      icon: <ApiOutlined />,
      label: "代理",
    },
    {
      key: "/test",
      icon: <ApiOutlined />,
      label: "test",
    },
  ];

  const switchProxyState = (key) =>{
    console.log(key ,ruleCount ,'key')
    if(key !== "/request-forward")return;

    if(ruleCount > 0 ){
      setRuleCount(0)
      RequestForwardService.removeAllRules()
    }else{
      RequestForwardService.initChromeRules()
    }

  }



  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`sidebar-item ${
              location.pathname === item.key ? "active" : ""
            }`}
            onClick={() => history.push(item.key)}
          >
            {ruleCount > 0 && item.key === "/request-forward" ? (
              <Badge count={ruleCount}   size="small">
                {" "}
                <div className="sidebar-icon" onDoubleClick={()=>{switchProxyState(item.key )}}>{item.icon} </div>
              </Badge>
            ) : (
              <div className="sidebar-icon"  onDoubleClick={()=>{switchProxyState(item.key )}}>{item.icon}</div>
            )}
            <span className="sidebar-label" >{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
