import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import path from 'path';  
import copy from 'rollup-plugin-copy'; // 引入 copy 插件  

export default defineConfig({  
  plugins: [  
    react(),  
    copy({  
      targets: [  
        { src: 'src/manifest.json', dest: 'dist' },
        { src: 'src/service-worker.js', dest: 'dist' }, // 将 manifest.json 从 src 复制到 dist  
      ],  
      hook: 'writeBundle' // 在打包完成后执行  
    })  
  ],  
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#b37feb', // 修改主题色为紫色
          '@link-color': '#b37feb',    // 链接色也跟随主题色
          '@success-color': '#b37feb',  // 成功色也使用相同的紫色
        },
      },
    },
  },
  resolve: {  
    alias: {  
      '@': path.resolve(__dirname, 'src'),  
      '@components': path.resolve(__dirname, 'src/components'),  
    },  
  }, 
  server: {
    proxy: {
      // 当遇到 /note 请求时，代理到 http://localhost:3000
      '/note': {
        target: 'http://localhost:3000',  // 代理目标
        changeOrigin: true,               // 是否修改请求的来源（将 Host 设置为 target）
        rewrite: (path) => path.replace(/^\/note/, '/note') // 如果路径有变化，可以重写
      }
    },
    watch: {
      usePolling: true,   // 使用轮询
      interval: 1000,     // 轮询间隔
    },
  },
  build: {  
    watch: {}, // 启用 watch 模式
    rollupOptions: {  
      output: {  
        entryFileNames: 'assets/js/[name].js',  
        chunkFileNames: 'assets/js/[name].js',  
        assetFileNames: 'assets/[name].[ext]',  
      }  
    }  
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
});



