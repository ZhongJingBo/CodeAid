const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', async (req, res) => {
  try {
    const response = await axios.get('/note/1729150028121');
    const $ = cheerio.load(response.data);
    
    // 在这里可以对页面进行处理，返回需要的数据
    const title = $('title').text();  // 举例：获取页面的 title 标签

    res.json({ title });
  } catch (error) {
    res.status(500).send('Error occurred while scraping');
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});