import axios from "axios";

export const requestKimi = (apiURL, apiKey) => {
  const data = {
    model: "moonshot-v1-8k",
    messages: [
      {
        role: "user",
        content: `请基于${documentation} ,生成${requestJSON}结构 ,且只返回json结构数据`,
      },
    ],
  };
  console.log(apiURL, "apiURL");
  return axios.post(apiURL, data, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
};


export const requestHtml = (url)=>{
    return axios.get(url)
}

/**
 * action
 *  1. 点击add 没有提交的话 提示信息 不要执行后续
 *  2. 点击后记录页面url，记录当前点击的key 
 *  3. 点击update 没有提交的话 提示信息 不要执行后续
 *  4. 在具备queryParams的input后判断是否有存储的key 有的话新增一个向下箭头的按钮 没有展示一个➕ 按钮
 *  5. 点击➕ 按钮后 新增一个hover展示的tooltip 展示input 包括备注，当前key 和 value  和确认按钮。
 *  6. 确认后将数据存储到本地。默认备注是空 
 *  7. 点击向下箭头按钮后 展示一个hover的tooltip 包括备注，存储的key 和 value 以及一个replace按钮

*/


// fetch 请求语雀 获取dom