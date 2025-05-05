require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { AccessToken, privileges } = require('../../nodejs/src/AccessToken');

const app = express();
app.use(cors());
app.use(express.json());

// 从环境变量获取配置
const APP_ID = process.env.APP_ID || '6814588b835c48039e87dad8';
const APP_KEY = process.env.APP_KEY || '6d85cdfaddf944569fab201652aa0697';
const PORT = process.env.PORT || 3000;

// 检查必要的环境变量
if (!APP_KEY) {
  console.error('错误: 环境变量APP_KEY未设置！');
  console.log('请按以下步骤设置环境变量：');
  console.log('1. 在火山引擎控制台获取APP_KEY');
  console.log('2. 设置环境变量：');
  console.log('   Windows PowerShell:');
  console.log('   $env:APP_KEY="你的APP_KEY"');
  console.log('   或者创建.env文件并添加：');
  console.log('   APP_KEY=你的APP_KEY');
  process.exit(1);
}

app.post('/generate-token', (req, res) => {
  try {
    console.log('收到生成token请求, body:', req.body);
    
    // 优先使用请求中的roomId，如果没有传入才生成新的
    let roomId = req.body.roomId;
    if (!roomId || roomId.trim() === '') {
      roomId = `room_${uuidv4().substring(0, 8)}`;
    }
    const userId = `user_${uuidv4().substring(0, 8)}`;
    
    console.log('生成的房间和用户信息：', { roomId, userId });
    console.log('使用的配置信息：', { APP_ID, roomId, userId });

    // 使用官方AccessToken模块生成token
    const token = new AccessToken(APP_ID, APP_KEY, roomId, userId);
    
    // 设置token过期时间（2小时）
    const expireTime = Math.floor(Date.now() / 1000) + 7200;
    token.expireTime(expireTime);
    
    // 添加权限
    token.addPrivilege(privileges.PrivPublishStream, expireTime);
    token.addPrivilege(privileges.PrivSubscribeStream, expireTime);
    
    // 生成token字符串
    const tokenStr = token.serialize();
    
    console.log('Token生成成功:', tokenStr);
    
    res.json({
      success: true,
      data: {
        roomId,
        userId,
        token: tokenStr
      }
    });
  } catch (error) {
    console.error('生成Token时发生错误：', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 添加健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Token服务器运行在端口 ${PORT}`);
  console.log('使用的APP_ID:', APP_ID);
  console.log('APP_KEY已配置');
});