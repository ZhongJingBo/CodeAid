import { useEffect, useRef } from 'react';

/**
 * 检测点击元素外部的 Hook
 * @param callback 点击外部时执行的回调函数
 * @returns 绑定目标元素的 ref
 */
export function useInputClickOutside(callback) {
  const ref = useRef(null);
  const callbackRef = useRef(callback);

  // 保持回调最新
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handleClick = (event) => {
      const { input } = ref.current || {}

    
      if(input?.value){
        return 
      }

      if (
        ref.current &&
        event.target instanceof Node &&
        !input.contains(event.target)
      ) {
        callbackRef.current();
      }
    };

    // 使用捕获阶段确保在子组件事件之前处理
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return ref;
}