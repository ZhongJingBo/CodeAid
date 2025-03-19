export const mock = {
  default: {
    key: "default",
    group: "default",
    groupEnabled: true,
    rule: [
      {
        id: 0,
        pattern: "^https://api\\.example\\.com/users/.*111",
        target: "https://test-api.example.com/users/",
        enabled: true,
      },
      {
        id: 1,
        pattern: "^https://api\\.example\\.com/orders/.*",
        target: "https://test-api.example.com/users/",
        enabled: true,
      },
    ],
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
