export const mock = {
  default: {
    key: "default",
    group: "default",
    groupEnabled: true,
    rule: [
      {
        id: 0,
        pattern: "^https://api.example.com/users/.*111",
        target: "https://test-api.example.com/users/",
        enabled: true,
      },
      {
        id: 1,
        pattern: "^https://api.example.com/orders/.*",
        target: "https://test-api.example.com/users/",
        enabled: true,
      },
    ],
    jsonc: `{
          // Use IntelliSense to learn about possible links.
          // Type \`rule\` to quick insert rule.
          "proxy": 
          [
            [
              "^https://api.example.com/users/.*111",
              "https://test-api.example.com/users/"
            ],
            [
              "^https://api.example.com/orders/.*",
            "https://test-api.example.com/users/"
            ],
            // \`Command/Ctrl + click\` to visit:
            // https://unpkg.com/react@16.4.1/umd/react.production.min.js
            // [
              // "(.*)/path1/path2/(.*)", // https://www.sample.com/path1/path2/index.js
              // "http://127.0.0.1:3000/$2", // http://127.0.0.1:3000/index.js
            // ],
          ],

        }
      `,
  },
  group1: {
    key: "group1",
    group: "group1",
    groupEnabled: false,
    rule: [
      {
        id: 0,
        pattern: "www.baidu.com",
        target: "work.1688.com",
        enabled: true,
      },
    ],
  },
};
