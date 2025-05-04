const SERVER_URL = 'http://localhost:3000';
const API_WHITE_LIST = `${SERVER_URL}/whitelist`;
const API_BLACK_LIST = `${SERVER_URL}/blacklist`;
const API_PERMISSION_MAP = `${SERVER_URL}/risk/permissionmap`;
const API_CLIENT_EXTENSIONS = `${SERVER_URL}/user`;

export function getPermissionMap() {
  return new Promise((resolve, reject) => {
    fetch(API_PERMISSION_MAP)
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('获取权限映射失败:', error);
        reject(error);
      });
  });
}

export function getWhiteList() {
  return new Promise((resolve, reject) => {
    fetch(API_WHITE_LIST)
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('获取扩展白名单失败:', error);
        reject(error);
      });
  });
}

export function getBlackList() {
  return new Promise((resolve, reject) => {
    fetch(API_BLACK_LIST)
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('获取扩展黑名单失败:', error);
        reject(error);
      });
  });
}

export function updateClientExtensions(data) {
  return new Promise((resolve, reject) => {
    fetch(API_CLIENT_EXTENSIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('更新客户端扩展失败:', error);
        reject(error);
      });
  });
}


export default {
  getPermissionMap,
  getWhiteList,
  getBlackList,
  updateClientExtensions
}