export type PermissionRiskLevel = "low" | "medium" | "high";

export type PermissionItem = {
  name?: string;
  score: number;
  riskLevel: PermissionRiskLevel;
  description: string;
}

export type PermissionMap = {
  [key: string]: PermissionItem;
};

export const PERMISSION_WEIGHTS: PermissionMap = {
  // ========== 高风险权限 (High) ==========
  "cookies": {
    score: 25,
    riskLevel: "high",
    description: "完全访问浏览器Cookie，可能泄露用户登录态和隐私数据"
  },
  "debugger": {
    score: 30,
    riskLevel: "high",
    description: "使用Chrome调试协议，可干预其他页面行为"
  },
  "desktopCapture": {
    score: 28,
    riskLevel: "high",
    description: "捕获屏幕/窗口内容，可能泄露敏感视觉信息"
  },
  "fileSystem": {
    score: 27,
    riskLevel: "high",
    description: "访问用户本地文件系统（需用户主动触发）"
  },
  "geolocation": {
    score: 22,
    riskLevel: "high",
    description: "获取精确地理位置信息"
  },
  "history": {
    score: 24,
    riskLevel: "high",
    description: "读取/修改浏览历史记录"
  },
  "management": {
    score: 26,
    riskLevel: "high",
    description: "管理其他扩展程序，可能被滥用"
  },
  "nativeMessaging": {
    score: 30,
    riskLevel: "high",
    description: "与本地应用程序通信，突破浏览器沙箱"
  },
  "privacy": {
    score: 23,
    riskLevel: "high",
    description: "修改隐私相关设置（如跟踪保护）"
  },
  "proxy": {
    score: 28,
    riskLevel: "high",
    description: "控制代理设置，可能监控所有网络流量"
  },
  "ttsEngine": {
    score: 20,
    riskLevel: "high",
    description: "拦截所有语音合成请求"
  },
  "webRequestBlocking": {
    score: 25,
    riskLevel: "high",
    description: "配合webRequest可修改/阻止网络请求"
  },
  "webviewTagBlocking": {
    score: 27,
    riskLevel: "high",
    description: "嵌入WebView组件，可能被滥用"
  },
  "webxrBlocking": {
    score: 29,
    riskLevel: "high",
    description: "访问WebXR API，可能被滥用"
  },
  "webxrHitTestBlocking": {
    score: 30,
    riskLevel: "high",
    description: "访问WebXR Hit Test API，可能被滥用"
  },
  "webxrArBlocking": {
    score: 31,
    riskLevel: "high",
    description: "访问WebXR AR API，可能被滥用"
  },
  "webxrVrBlocking": {
    score: 32,
    riskLevel: "high",
    description: "访问WebXR VR API，可能被滥用"
  },
  "webxrHandTrackingBlocking": {
    score: 33,
    riskLevel: "high",
    description: "访问WebXR手部追踪API，可能被滥用"
  },
  "webxrDepthBlocking": {
    score: 34,
    riskLevel: "high",
    description: "访问WebXR深度API，可能被滥用"
  },
  "webxrDomOverlayBlocking": {
    score: 35,
    riskLevel: "high",
    description: "访问WebXR DOM覆盖API，可能被滥用"
  },
  "webxrHitTestSourceBlocking": {
    score: 36,
    riskLevel: "high",
    description: "访问WebXR Hit Test Source API，可能被滥用"
  },
  "webxrHandTrackingSourceBlocking": {
    score: 37,
    riskLevel: "high",
    description: "访问WebXR手部追踪源API，可能被滥用"
  },
  "webxrDepthSourceBlocking": {
    score: 38,
    riskLevel: "high",
    description: "访问WebXR深度源API，可能被滥用"
  },
  "webxrDomOverlaySourceBlocking": {
    score: 39,
    riskLevel: "high",
    description: "访问WebXR DOM覆盖源API，可能被滥用"
  },

  // ========== 中风险权限 (Medium) ==========
  "activeTab": {
    score: 12,
    riskLevel: "medium",
    description: "临时访问当前活动标签页"
  },
  "bookmarks": {
    score: 15,
    riskLevel: "medium",
    description: "访问/修改书签数据"
  },
  "contentSettings": {
    score: 14,
    riskLevel: "medium",
    description: "修改内容设置（如Cookie、JavaScript开关）"
  },
  "contextMenus": {
    score: 10,
    riskLevel: "medium",
    description: "添加右键菜单项，可能诱导用户操作"
  },
  "downloads": {
    score: 16,
    riskLevel: "medium",
    description: "管理下载文件，可能下载恶意内容"
  },
  "fontSettings": {
    score: 8,
    riskLevel: "medium",
    description: "修改字体设置，影响隐私指纹"
  },
  "notifications": {
    score: 10,
    riskLevel: "medium",
    description: "显示系统通知，可能用于钓鱼"
  },
  "pageCapture": {
    score: 18,
    riskLevel: "medium",
    description: "保存页面为MHTML（含敏感数据）"
  },
  "sessions": {
    score: 15,
    riskLevel: "medium",
    description: "访问最近关闭的标签页/窗口"
  },
  "storage": {
    score: 12,
    riskLevel: "medium",
    description: "访问local/sync存储空间"
  },
  "tabCapture": {
    score: 18,
    riskLevel: "medium",
    description: "捕获标签页内容流"
  },
  "topSites": {
    score: 14,
    riskLevel: "medium",
    description: "访问用户最常访问的网站列表"
  },
  "webNavigation": {
    score: 12,
    riskLevel: "medium",
    description: "监控导航事件（URL变化）"
  },
  "webRequest": {
    score: 16,
    riskLevel: "medium",
    description: "监控网络请求（需配合webRequestBlocking才有修改能力）"
  },
  "webviewTag": {
    score: 15,
    riskLevel: "medium",
    description: "嵌入WebView组件（需用户主动触发）"
  },
  "webxr": {
    score: 11,
    riskLevel: "medium",
    description: "访问WebXR API（需用户主动触发）"
  },
  "webxrHitTest": {
    score: 12,
    riskLevel: "medium",
    description: "访问WebXR Hit Test API（需用户主动触发）"
  },
  "webxrAr": {
    score: 13,
    riskLevel: "medium",
    description: "访问WebXR AR API（需用户主动触发）"
  },
  "webxrVr": {
    score: 14,
    riskLevel: "medium",
    description: "访问WebXR VR API（需用户主动触发）"
  },
  "webxrHandTracking": {
    score: 15,
    riskLevel: "medium",
    description: "访问WebXR手部追踪API（需用户主动触发）"
  },
  "webxrDepth": {
    score: 16,
    riskLevel: "medium",
    description: "访问WebXR深度API（需用户主动触发）"
  },
  "webxrDomOverlay": {
    score: 17,
    riskLevel: "medium",
    description: "访问WebXR DOM覆盖API（需用户主动触发）"
  },
  "webxrHitTestSource": {
    score: 18,
    riskLevel: "medium",
    description: "访问WebXR Hit Test Source API（需用户主动触发）"
  },
  "webxrHandTrackingSource": {
    score: 19,
    riskLevel: "medium",
    description: "访问WebXR手部追踪源API（需用户主动触发）"
  },
  "webxrDepthSource": {
    score: 19,
    riskLevel: "medium",
    description: "访问WebXR深度源API（需用户主动触发）"
  },
  "webxrDomOverlaySource": {
    score: 20,
    riskLevel: "medium",
    description: "访问WebXR DOM覆盖源API（需用户主动触发）"
  },

  // ========== 低风险权限 (Low) ==========
  "alarms": {
    score: 3,
    riskLevel: "low",
    description: "定时触发后台任务"
  },
  "background": {
    score: 2,
    riskLevel: "low",
    description: "后台持久化运行"
  },
  "clipboardRead": {
    score: 8,
    riskLevel: "low",
    description: "读取剪贴板（需用户主动触发）"
  },
  "clipboardWrite": {
    score: 15,
    riskLevel: "low",
    description: "将数据写入剪贴板,可能覆盖用户数据，但是应用时数据用户可见，不会泄露"
  },
  "declarativeContent": {
    score: 3,
    riskLevel: "low",
    description: "根据页面内容显示扩展图标"
  },
  "idle": {
    score: 5,
    riskLevel: "low",
    description: "检测用户空闲状态"
  },
  "power": {
    score: 1,
    riskLevel: "low",
    description: "阻止系统休眠（特定场景）"
  },
  "tabs": {
    score: 6,
    riskLevel: "low",
    description: "访问标签页元数据（不含页面内容）"
  },
  "unlimitedStorage": {
    score: 7,
    riskLevel: "low",
    description: "突破本地存储大小限制"
  },
  "sidePanel": {
    score: 4,
    riskLevel: "low",
    description: "在侧边栏显示扩展内容"
  },
  "webRequestFeedback": {
    score: 4,
    riskLevel: "low",
    description: "获取用户反馈的网络请求数据"
  },
  "webview": {
    score: 5,
    riskLevel: "low",
    description: "嵌入WebView组件"
  },
} as const;

export default PERMISSION_WEIGHTS;