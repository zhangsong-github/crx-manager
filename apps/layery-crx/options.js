import { getPermissionMap } from './api.js';

let permissionMap = {};

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
        const riskLevel = permissionMap[p] && permissionMap[p].riskLevel;
        if (riskLevel === 'high') return 'high';
        if(riskLevel === 'medium') return 'medium';
        if(riskLevel === 'low') return 'low';
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
      <td width="20%" class="status">${ext.enabled ? '已启用' : '已禁用'}</td>
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
      const enabled = btn.dataset.status === 'true' ? false : true;
      chrome.management.setEnabled(extId, enabled, () => {
        if (chrome.runtime.lastError) {
          console.error('操作失败:', chrome.runtime.lastError);
          alert(`操作失败: ${chrome.runtime.lastError.message}`);
          return;
        }
        updateExtensionRow(extId, enabled);
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

function updateExtensionRow(extId, enabled) {
  const tr = document.querySelector(`tr[data-id="${extId}"]`);
  if (tr) {
    const statusCell = tr.querySelector('.status');
    statusCell.textContent = enabled ? '已启用' : '已禁用';
    const toggleBtn = tr.querySelector('.toggle-btn');
    toggleBtn.textContent = enabled ? '禁用' : '启用';
    toggleBtn.dataset.status = enabled;
  }
}

function showPermissionsDialog(permissions) {
  const prevDialog = document.querySelector('.permissions-dialog');
  if (prevDialog) {
    prevDialog.remove();
  }
  const dialog = document.createElement('div');
  dialog.className = 'permissions-dialog';
  const permissionList = permissions.map(p => {
    if (p.trim() === '') return '';
    const permission = permissionMap[p.trim()];
    const description = permission.description || '未知权限';
    const riskLevel = permission.riskLevel || '未知风险';
    return `<div class="permission-item">
      <span class="title" title="${p}">${p}</span>
      <span class="desc" title="${description}">${description}</span>
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

document.addEventListener('DOMContentLoaded', async () => {
  permissionMap = await getPermissionMap();
  initExtensionsList();
});
