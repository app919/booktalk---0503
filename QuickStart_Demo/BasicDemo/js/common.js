/**
 * Copyright 2024 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

'use strict';

const OFFVIDEOICON = '/assets/videoOffIcon.png';
const ONVIDEOICON = '/assets/videoOnIcon.png';
const OFFMICICON = '/assets/micOffIcon.png';
const ONMICICON = '/assets/micOnIcon.png';

const TEXTMAP = {
  'room-id': '房间ID',
  'user-id': '用户ID',
};

let isMicOn = true; // control the mic
let isVideoOn = true; // control the video

const config = {
  appId: '6814588b835c48039e87dad8',
  roomId: '',
  uid: '',
  token: ''
};

const initStreamOption = {
  resolution: {
    width: 640,
    height: 480,
  },
  frameRate: {
    min: 10,
    max: 15,
  },
  bitrate: {
    min: 250,
    max: 600,
  },
};

const streamOptions = {
  audio: true,
  video: true,
};

// 从服务器获取Token和ID
async function generateTokenAndIds() {
  try {
    // 优先使用URL中的roomId
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get('roomId');
    
    console.log('从URL获取到的roomId:', roomIdFromUrl);

    const response = await fetch('http://localhost:3000/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: roomIdFromUrl
      })
    });
    
    const result = await response.json();
    console.log('服务器返回结果:', result);
    
    if (result.success) {
      config.roomId = result.data.roomId;
      config.uid = result.data.userId;
      config.token = result.data.token;
      
      console.log('获取到的配置:', config);
      
      // 自动填充表单
      $('#room-id').val(config.roomId);
      $('#user-id').val(config.uid);
      
      // 如果URL中没有roomId，更新URL
      if (!roomIdFromUrl) {
        changeUrl(config.roomId);
      }
      
      return true;
    } else {
      console.error('获取Token失败:', result.error);
      return false;
    }
  } catch (error) {
    console.error('请求Token服务器失败:', error);
    return false;
  }
}

function checkReg(name) {
  const inputValue = $(`#${name}`).val();
  let hasError = false;
  if (!inputValue) {
    $(`#${name}`).css('border-color', '#ff4d4f');
    $(`#${name}-text`).text(`请输入${TEXTMAP[name]}`);
    hasError = true;
  } else if (!/^[0-9a-zA-Z_\-@.]{1,128}$/.test(inputValue)) {
    $(`#${name}`).css('border-color', '#ff4d4f');
    $(`#${name}-text`).text(`${TEXTMAP[name]}输入有误，请重新输入`);
    hasError = true;
  } else {
    $(`#${name}-text`).text('');
    $(`#${name}`).css('border-color', '#d9d9d9');
    hasError = false;
  }
  return hasError;
}

function checkRoomIdAndUserId(name) {
  $(`#${name}`).keyup(() => {
    checkReg(name);
  });
}

function getUrlArgs() {
  var args = {};
  var query = window.location.search.substring(1);
  var pairs = query.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var name = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    value = decodeURIComponent(value);
    args[name] = value;
  }
  return args;
}

function changeUrl(roomId) {
  // 保持当前路径，只修改 query 参数
  const currentPath = window.location.pathname;
  const baseUrl = `${window.location.origin}${currentPath}?roomId=${roomId}`;
  window.history.replaceState('', '', baseUrl);
}

function setSessionInfo(params) {
  Object.keys(params).forEach((key) => {
    sessionStorage.setItem(key, params[key]);
  });
}

function removeLoginInfo() {
  const variable = ['roomId', 'uid'];
  variable.forEach((v) => sessionStorage.removeItem(v));
}

function getSessionInfo() {
  const roomId = sessionStorage.getItem('roomId');
  const uid = sessionStorage.getItem('uid');
  return {
    roomId,
    uid,
  };
}

function checkLoginInfo() {
  const { roomId } = getUrlArgs();
  roomId && setSessionInfo({ roomId });

  const _roomId = roomId;
  const _uid = sessionStorage.getItem('uid');

  let hasLogin = true;
  if (!_roomId || !_uid) {
    hasLogin = false;
  } else if (
    !/^[0-9a-zA-Z_\-@.]{1,128}$/.test(_roomId) ||
    !/^[0-9a-zA-Z_\-@.]{1,128}$/.test(_uid)
  ) {
    hasLogin = false;
  }
  return hasLogin;
}

function fillRoomId() {
  $('#room-id').val(config.roomId);
}
