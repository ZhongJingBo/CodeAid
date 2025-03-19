# CodeAid
CodeAid

my-sidebar-extension/
├── manifest.json
├── sidebar/
│   ├── sidebar.html
│   ├── sidebar.css
│   └── sidebar.js
├── content-scripts/
│   └── inject-sidebar.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── background.js


1. 解析当前页面的dom结构 获取所有sciprt 做代理
2. 先实现代理功能 
3. mock数据功能 （插件mock数据  ）
4. 代理结构 1. 代理组 2.单组选择是否开启代理 