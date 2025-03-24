import React, { useEffect, useRef } from "react";
import "./index.less";

const Editor = ({ jsonc,onChange }) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  const getData = () => {
    if (!jsonc) {
      return "";
    }
    return jsonc;
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // 配置 Monaco 加载器
    window.require.config({
      paths: {
        vs: "../../lib/monaco-editor/min/vs",
      },
    });

    // 加载 Monaco
    window.require(["vs/language/json/monaco.contribution"], function () {
      if (!window.monaco) {
        console.error("Monaco not loaded");
        return;
      }

      try {
        const editor = window.monaco.editor.create(editorRef.current, {
          value: getData(),
          language: "json", 
          theme: "vs",
          automaticLayout: true,
        });

        editorInstanceRef.current = editor;

        // 监听编辑器内容变化
        editor.onDidChangeModelContent(() => {
          const value = editor.getValue();
          onChange(value)
        });

        // 打印成功信息
        console.log("Editor created successfully");

        return () => {
          if (editor) {
            editor.dispose();
          }
        };
      } catch (error) {
        console.error("Editor creation failed:", error);
      }
    });
  }, [editorRef.current]);

  // 添加一些基础样式确保编辑器容器正确显示
  return <div ref={editorRef} className="editor-container" />;
};

export default Editor;
