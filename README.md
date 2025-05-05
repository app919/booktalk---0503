# WebRTC 视频通话演示项目

这是一个基于火山引擎实时音视频SDK的WebRTC演示项目，支持多人视频通话功能。

## 环境要求

- Node.js v14.0.0 或更高版本
- Windows/Linux/MacOS 操作系统
- 现代浏览器(Chrome/Firefox/Safari等)

## 项目结构

```
.
├── QuickStart_Demo/
│   └── BasicDemo/
│       ├── assets/         # 图标等静态资源
│       ├── css/           # 样式文件
│       ├── js/            # JavaScript源码
│       ├── lib/           # 第三方库
│       ├── index.html     # 主页面
│       └── server.js      # Token服务器
├── nodejs/                # Node.js SDK
└── README.md             # 说明文档
```

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/app919/booktalk---0503.git
cd booktalk---0503
```

2. 安装依赖
```bash
cd QuickStart_Demo/BasicDemo
npm install
# 或者使用yarn
yarn install
```

3. 启动服务器(需要开两个终端)

终端1 - 启动Token服务器(3000端口):
```bash
cd QuickStart_Demo/BasicDemo
node server.js
```

终端2 - 启动静态文件服务器(6001端口):
```bash
# 在项目根目录下运行
npx http-server . -p 6001 --cors -c-1
```

4. 访问应用
在浏览器中打开:
```
http://localhost:6001/QuickStart_Demo/BasicDemo/index.html?roomId=your_room_id
```

## 配置说明

项目使用以下默认配置:
- APP_ID: 6814588b835c48039e87dad8
- APP_KEY: 6d85cdfaddf944569fab201652aa0697
- Token服务器端口: 3000
- 静态文件服务器端口: 6001

可以通过环境变量或.env文件修改这些配置。

## 常见问题与解决方案

1. 端口占用问题
   - 错误信息: `Error: listen EADDRINUSE: address already in use`
   - 解决方案: 
     ```bash
     # Windows
     Stop-Process -Name "node" -Force
     # Linux/Mac
     pkill node
     ```

2. 404错误
   - 确保URL格式正确，必须包含index.html
   - 正确格式: `http://localhost:6001/QuickStart_Demo/BasicDemo/index.html?roomId=xxx`
   - 错误格式: `http://localhost:6001/QuickStart_Demo/BasicDemo/?roomId=xxx`

3. Token服务器无响应
   - 确保在正确的目录下启动server.js
   - 检查3000端口是否被占用
   - 确认APP_ID和APP_KEY配置正确

4. 静态资源404
   - 确保在项目根目录启动http-server
   - 检查assets目录中的资源文件是否存在
   - 验证文件路径大小写是否正确

## 多设备测试说明

1. 同一局域网内测试:
   - 使用服务器的局域网IP替换localhost
   - 例如: `http://192.168.x.x:6001/QuickStart_Demo/BasicDemo/index.html?roomId=xxx`

2. 不同设备加入同一房间:
   - 使用相同的roomId参数
   - 每个用户会自动获得唯一的userId

## 开发建议

1. 调试工具:
   - 使用Chrome开发者工具的Network面板监控请求
   - 查看Console面板的日志输出
   - 使用Elements面板检查DOM结构

2. 代码修改:
   - 修改后需要重启相应的服务器
   - token服务器修改需重启node server.js
   - 前端代码修改会立即生效(已禁用缓存)

## 注意事项

1. 安全性:
   - 生产环境中请使用自己的APP_ID和APP_KEY
   - 不要在公开场合暴露密钥信息
   - 建议使用环境变量管理敏感信息

2. 性能优化:
   - 可以使用PM2等工具管理Node进程
   - 考虑使用nginx反向代理
   - 生产环境建议使用HTTPS

## 许可证

MIT License
