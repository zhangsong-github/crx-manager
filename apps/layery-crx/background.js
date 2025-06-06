import { getWhiteList, getBlackList, updateClientExtensions } from './api.js';

const userId = '1234567890'; // 用户ID

let whiteList = [];
let blackList = [];

function checkExtInfo(extension) {
  console.log('扩展名称:', extension.name);
  console.log('扩展ID:', extension.id);
  console.log('权限:', extension.permissions);

  if(whiteList.includes(extension.id)) {
    console.log('白名单扩展');
    chrome.management.setEnabled(extension.id, true, () => {
      console.log(`白名单扩展 ${extension.name} 已被强制启用`);
    });
  }
  if(blackList.includes(extension.id)) {
    console.log('黑名单扩展');
    chrome.management.setEnabled(extension.id, false, () => {
      console.log(`扩展 ${extension.name} 已被强制禁用`);
    });
    // chrome.management.uninstall(extension.id, { showConfirmDialog: true }, () => {
    //   console.log(`扩展 ${extension.name} 已被卸载`);
    // });
  }
  console.log('----------------------------------');
}

async function checkAllExtPermissions() {
  
  whiteList = (await getWhiteList()).map(item => item.id);
  blackList = (await getBlackList()).map(item => item.id);
  console.log('白名单:', whiteList);
  console.log('黑名单:', blackList);

  chrome.management.getAll((data) => {
    const extensions = data.filter(ext => ext.type === 'extension');
    updateClientExtensions({
      id: userId,
      extensions
    }).then(response => {
      console.log('扩展信息已更新:', response);
    }).catch(error => {
      console.error('更新扩展信息失败:', error);
    })
    console.log('所有扩展:', extensions);
    // 遍历每个扩展，提取权限信息
    extensions.forEach((extension) => {
      checkExtInfo(extension);
    });
  });
}

function addListener() {
  chrome.management.onEnabled.addListener(extensionInfo => {
    console.log('扩展启用:', extensionInfo);
    checkExtInfo(extensionInfo);
  });
  chrome.management.onDisabled.addListener(extensionInfo => {
    console.log('扩展禁用:', extensionInfo);
    checkExtInfo(extensionInfo);
  });
  chrome.management.onInstalled.addListener(extensionInfo => {
    console.log('扩展安装:', extensionInfo);
    checkExtInfo(extensionInfo);
  });
  chrome.management.onInstalled.addListener(extensionInfo => {
    console.log('扩展卸载:', extensionInfo);
  });

}

chrome.runtime.onInstalled.addListener(() => {
  checkAllExtPermissions();
  addListener();
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));