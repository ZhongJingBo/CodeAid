import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './sideBar.css';
import {
  PaperClipOutlined
} from '@ant-design/icons';

const SideBar = () => {
  const history = useHistory();
  const location = useLocation();

  const menuItems = [
    { icon: <PaperClipOutlined /> ,label: '链接', path: '/' },
    // { icon: <EditOutlined />, label: '写作', path: '/writing' },
    // { icon: <TranslationOutlined />, label: '翻译', path: '/translation' },
    // { icon: <ScanOutlined />, label: 'OCR', path: '/ocr' },
    // { icon: <SettingOutlined />, label: '语法', path: '/grammar' },
    // { icon: <QuestionCircleOutlined />, label: '提问', path: '/question' },
    // { icon: <MoreOutlined />, label: '更多', path: '/more' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => history.push(item.path)}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <span className="sidebar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;