// /options.js

const permissionDescriptions = {
  tabs: '访问浏览器标签页',
  storage: '使用本地存储功能',
  notifications: '显示桌面通知',
  background: '后台运行支持',
  bookmarks: '管理书签',
  history: '访问浏览历史',
  cookies: '访问/编辑Cookies',
  webRequest: '拦截和修改网络请求，有可能窃取用户隐私信息',
  webRequestBlocking: '拦截和修改网络请求（阻塞），有可能窃取用户隐私信息',
  contextMenus: '添加上下文菜单',
  alarms: '设置定时器和闹钟',
  downloads: '访问下载任务',
  'downloads.shelf': '显示当前正在下载的文件列表和状态', 
  geolocation: '访问地理位置',
  clipboardRead: '读取剪贴板内容，有可能窃取用户隐私信息',
  clipboardWrite: '写入剪贴板内容，有可能注入恶意代码',
  activeTab: '访问当前活动标签页',
  management: '管理扩展程序，有可能会影响浏览器的安全性和隐私',
  history: '访问浏览历史记录，有数据泄露的风险',
  topSites: '访问常用网站',
  bookmarks: '访问书签',
  pageCapture: '捕获页面内容，有数据泄露的风险',
  identity: '访问用户身份信息，有数据泄露的风险',
  webNavigation: '访问浏览器导航事件，有可能会影响浏览器的安全性和隐私',
  webview: '使用WebView标签',
  declarativeNetRequest: '声明式网络请求，有可能会影响浏览器的安全性和隐私',
  declarativeNetRequestFeedback: '声明式网络请求反馈，有可能会影响浏览器的安全性和隐私',
  enterprise: '企业管理功能',
  fileSystem: '访问文件系统，有数据泄露的风险',
  unlimitedStorage: '使用无限存储空间，不受存储限制',
  devtools: '访问开发者工具， 有可能会影响浏览器的安全性和隐私',
  scripting: '访问脚本功能，如注入脚本，有窃取用户信息的风险',
  // 可以继续补充其他常见权限
};

const highRiskPermissions = [
  'cookies',
  'webRequest',
  'webRequestBlocking',
  'downloads',
  'downloads.shelf',
  'clipboardRead',
  'clipboardWrite',
  'management',
  'history',
  'fileSystem',
  'declarativeNetRequest',
  'declarativeNetRequestFeedback',
  'pageCapture',
  'identity',
  'geolocation',
  'devtools',
  'scripting',
];
const mediumRiskPermissions = [
  'tabs',
  'storage',
  'notifications',
  'background',
  'bookmarks',
  'activeTab',
  'unlimitedStorage',
  'contextMenus',
  'webNavigation',
]
const lowRiskPermissions = [
  'alarms',
  'topSites',
  'webview',
  'enterprise',
]

document.addEventListener('DOMContentLoaded', () => {
  initExtensionsList();
});

function initExtensionsList() {
  const appContainer = document.getElementById('app');

  const table = document.createElement('table');
  table.className = 'extensions-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th width="25%">扩展名称</th>
        <th width="20%">版本</th>
        <th width="20%">风险评级</th>
        <th width="20%">状态</th>
        <th width="15%" style="min-width: 110px;">操作</th>
      </tr>
    </thead>
    <tbody id="extensions-tbody">
    </tbody>
  `;

  appContainer.appendChild(table);

  loadExtensions();
}

function loadExtensions() {
  chrome.management.getAll(extensions => {
    const tbody = document.getElementById('extensions-tbody');
    tbody.innerHTML = '';

    const extensionsList = extensions.filter(ext => ext.type === 'extension');

    extensionsList.forEach(ext => {      
      const isSelf = ext.id === chrome.runtime.id;
      const permissions = ext.permissions || [];
      const riskList = permissions.map(p => {
        if (highRiskPermissions.includes(p)) return 'high';
        if (mediumRiskPermissions.includes(p)) return 'medium';
        if (lowRiskPermissions.includes(p)) return 'low';
        return 'unknown';
      });
      const riskLevel = riskList.includes('high') ? 'high' : riskList.includes('medium') ? 'medium' : riskList.includes('low') ? 'low' : 'unknown';
      const tr = document.createElement('tr');
      tr.dataset.id = ext.id;
      tr.innerHTML = `
      <td width="25%">${ext.name}</td>
      <td with="20%">${ext.version}</td>
      <td with="20%">
        <span class="tag ${riskLevel === 'high' ? 'danger' : riskLevel === 'medium' ? 'warning' : ''}">
          ${riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : riskLevel === 'low' ? '低风险' : '未知风险'}
        </span>
      </td>
      <td width="20%">${ext.enabled ? '已启用' : '已禁用'}</td>
      <td width="15%" style="min-width: 110px;">
        ${
          isSelf
            ? '<span class="disabled-text" title="内置扩展不可操作">-</span>'
            : `
              <button class="toggle-btn" data-id="${ext.id}" data-status="${ext.enabled}">
                ${ext.enabled ? '禁用' : '启用'}
              </button>
              <button class="permissions-btn" data-permissions="${ext.permissions.join(',')}">
                权限
              </button>
            `
        }
      </td>
    `;

      tbody.appendChild(tr);
    });

    bindTableEvents();
  });
}

function bindTableEvents() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const extId = btn.dataset.id;
      const enable = btn.dataset.status === 'true' ? false : true;

      chrome.management.setEnabled(extId, enable, () => {
        if (chrome.runtime.lastError) {
          console.error('操作失败:', chrome.runtime.lastError);
          alert(`操作失败: ${chrome.runtime.lastError.message}`);
          return;
        }
        updateExtensionRow(extId);
      });
    });
  });

  document.querySelectorAll('.permissions-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const permissions = btn.dataset.permissions.split(',');
      showPermissionsDialog(permissions);
    });
  });
}

function updateExtensionRow(extId) {
  chrome.management.get(extId, ext => {
    const tr = document.querySelector(`tr[data-id="${extId}"]`);
    if (tr) {
      tr.querySelector('td:nth-child(3)').textContent = ext.enabled ? '已启用' : '已禁用';
      const toggleBtn = tr.querySelector('.toggle-btn');
      toggleBtn.textContent = ext.enabled ? '禁用' : '启用';
      toggleBtn.dataset.status = ext.enabled;
    }
  });
}

function showPermissionsDialog(permissions) {
  const prevDialog = document.querySelector('.permissions-dialog');
  if (prevDialog) {
    prevDialog.remove();
  }
  const dialog = document.createElement('div');
  dialog.className = 'permissions-dialog';
  const permissionList = permissions.map(p => {
    const desc = permissionDescriptions[p.trim()] || '未知权限';
    const riskLevel = highRiskPermissions.includes(p) ? 'high' : mediumRiskPermissions.includes(p) ? 'medium' : lowRiskPermissions.includes(p) ? 'low' : 'unknown'; 
    return `<div class="permission-item">
      <span class="title" title="${p}">${p}</span>
      <span class="desc" title="${desc}">${desc}</span>
      <span class="tag-list">
        ${riskLevel === 'high' ? '<span class="tag danger">高风险</span>' : ''}
        ${riskLevel === 'medium' ? '<span class="tag warning">中风险</span>' : ''}
        ${riskLevel === 'low' ? '<span class="tag">低风险</span>' : ''}
        ${riskLevel === 'unknow' ? '<span class="tag">未知风险</span>' : ''}
      </span>
    </div>`;
  }).join('');

  dialog.innerHTML = `
    <div class="dialog-content">
      <h3>扩展权限列表</h3>
      <div class="permission-list">
        <div class="permission-header">
          <span class="title">权限名称</span>
          <span class="desc">权限描述</span>
          <span class="tag-list">风险分级</span>
        </div>
        ${permissionList}
      </div>
      <button class="close-btn">关闭</button>
    </div>
  `;

  dialog.querySelector('.close-btn').addEventListener('click', () => {
    dialog.remove();
  });

  document.body.appendChild(dialog);
}
