const CryptoJS = require('crypto-js');

class RtcTokenBuilder {
  static buildToken(appId, appKey, roomId, userId, options = {}) {
    console.log('开始生成Token，参数：', { appId, roomId, userId, options });

    const {
      tokenExpire = 24 * 60 * 60,  // 24小时过期
      role = 1  // 1表示主播
    } = options;

    // 当前时间戳（秒）
    const timestamp = Math.floor(Date.now() / 1000);
    const expireTime = timestamp + tokenExpire;
    console.log('时间信息：', { timestamp, expireTime });

    // 构建二进制消息
    const msgParts = [
      Buffer.from([0x00]), // 版本标记
      Buffer.from(roomId),
      Buffer.from([0x08]), // 房间ID分隔符
      Buffer.from(userId),
      Buffer.from([0x06]), // 用户ID分隔符
      Buffer.from([0x00, 0x00, 0x00, 0x00]), // 权限时间戳1
      Buffer.from([0x00, 0x00, 0x00, 0x00]), // 权限时间戳2
      Buffer.from([0x00, 0x00, 0x00, 0x00]), // 权限时间戳3
      Buffer.from([0x00, 0x00, 0x00, 0x00]), // 权限时间戳4
      Buffer.from([0x00, 0x00, 0x00, 0x00]), // 权限时间戳5
      Buffer.from([0x20, 0x00]), // 权限标记
    ];

    // 写入过期时间
    for (let i = 5; i < 10; i++) {
      msgParts[i].writeUInt32BE(expireTime, 0);
    }

    // 合并所有部分
    const message = Buffer.concat(msgParts);
    console.log('生成的二进制消息：', message.toString('hex'));

    // 使用HMAC-SHA256生成签名
    const hmac = CryptoJS.HmacSHA256(message.toString('binary'), appKey);
    const signature = Buffer.from(hmac.toString(CryptoJS.enc.Hex), 'hex');

    // 组合最终的token (版本号[3] + appId[24] + base64(message + signature))
    const content = Buffer.concat([message, signature]);
    const token = "001" + appId + content.toString('base64');

    console.log('生成的token：', token);
    return token;
  }
}

module.exports = RtcTokenBuilder; 