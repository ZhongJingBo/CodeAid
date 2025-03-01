export const mockUrls = [
  {
    baseUrl: 'https://example.com/api/v1/users',
    queryParams: {
      page: '1',
      size: '10',
      sort: 'desc',
      filter: 'active'
    }
  },
  {
    baseUrl: 'https://api.example.com/products',
    queryParams: {
      category: 'electronics',
      price_min: '100',
      price_max: '1000',
      brand: 'samsung'
    }
  },
  {
    baseUrl: 'https://search.example.com/search',
    queryParams: {
      q: 'smartphone',
      region: 'US',
      lang: 'en',
      type: 'all'
    }
  }
];

// 模拟获取当前URL数据
export const getMockCurrentUrl = () => {
  const randomIndex = Math.floor(Math.random() * mockUrls.length);
  const mockData = mockUrls[randomIndex];
  
  // 构建完整URL
  const queryString = Object.entries(mockData.queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    
  return `${mockData.baseUrl}?${queryString}`;
}; 