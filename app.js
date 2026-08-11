/* ============ 全局变量 ============ */
let currentPriceData = [];
let currentStats = null;
let refreshTimer = null;
let refreshInterval = 30000;
let isStaticMode = false; // GitHub Pages 纯静态模式标记

/* =============================================================
 * 内嵌后端数据生成器：
 *  - 后端 Express server 可用时 → 走 /api/* 真实接口
 *  - 接口不可用时（GitHub Pages / 静态部署）→ 走本函数生成同结构数据
 *  确保 https://285435.github.io/ops-learning/ 也能 100% 完整运行
 * ============================================================= */
const staticGenerator = {
  platforms: [
    { id: 1, name: '交易猫', icon: '🐱', trustLevel: '高' },
    { id: 2, name: '5173游戏交易网', icon: '🎮', trustLevel: '高' },
    { id: 3, name: '闲鱼', icon: '🐟', trustLevel: '中' },
    { id: 4, name: '转转', icon: '🔄', trustLevel: '中' },
    { id: 5, name: 'DD373', icon: '💰', trustLevel: '高' },
    { id: 6, name: '爬猴网', icon: '🐵', trustLevel: '中' },
    { id: 7, name: '酷游网游', icon: '🎯', trustLevel: '高' },
    { id: 8, name: '7881游戏交易', icon: '🎪', trustLevel: '中' },
  ],
  sellerNames: [
    '信誉商家小王', '金牌卖家小李', '十年老店', '钻石店铺', '皇冠卖家',
    '官方认证店', '极速发货', '安全交易中心', '放心购', '首选商家'
  ],
  prices() {
    const minPrice = 950;
    const maxPrice = 1100;
    const prices = [];
    this.platforms.forEach(p => {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        let price = minPrice + Math.floor(Math.random() * (maxPrice - minPrice + 1));
        if (Math.random() < 0.1) {
          price = 900 + Math.floor(Math.random() * 100);
        }
        prices.push({
          id: `${p.id}-${i}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
          platformId: p.id,
          platformName: p.name,
          platformIcon: p.icon,
          trustLevel: p.trustLevel,
          price: price,
          originalPrice: price + 10 + Math.floor(Math.random() * 50),
          seller: this.sellerNames[Math.floor(Math.random() * this.sellerNames.length)],
          stock: 10 + Math.floor(Math.random() * 500),
          soldCount: 50 + Math.floor(Math.random() * 2000),
          updateTime: new Date().toISOString(),
          deliveryTime: 5 + Math.floor(Math.random() * 30),
          discount: (85 + Math.random() * 10).toFixed(1)
        });
      }
    });
    const filtered = prices.filter(p => p.price >= minPrice).sort((a, b) => a.price - b.price);
    return {
      success: true,
      data: filtered,
      totalCount: filtered.length,
      minPrice: filtered.length ? Math.min(...filtered.map(p => p.price)) : 0,
      maxPrice: filtered.length ? Math.max(...filtered.map(p => p.price)) : 0,
      avgPrice: filtered.length ? Math.round(filtered.reduce((s, p) => s + p.price, 0) / filtered.length) : 0,
      lastUpdate: new Date().toISOString(),
      threshold: minPrice
    };
  },
  stats() {
    const now = new Date();
    const data = {
      todayLow: 950 + Math.floor(Math.random() * 30),
      todayHigh: 1050 + Math.floor(Math.random() * 50),
      todayOpen: 980 + Math.floor(Math.random() * 40),
      currentAvg: 990 + Math.floor(Math.random() * 50),
      volume24h: 10000 + Math.floor(Math.random() * 50000),
      priceChange: (-2 + Math.random() * 6).toFixed(2),
      activeSellers: 50 + Math.floor(Math.random() * 100),
      activeListings: 200 + Math.floor(Math.random() * 500),
      updateTime: now.toISOString(),
      history: []
    };
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const low = 950 + Math.floor(Math.random() * 30);
      const high = 1020 + Math.floor(Math.random() * 50);
      data.history.push({
        date: d.toISOString().split('T')[0],
        avg: low + Math.floor(Math.random() * (high - low)),
        low, high,
        volume: 5000 + Math.floor(Math.random() * 30000)
      });
    }
    return { success: true, data };
  }
};

/* ============ 初始化 ============ */
document.addEventListener('DOMContentLoaded', () => {
  fetchPriceData();
  fetchStatsData();
  startAutoRefresh();
});

/* ============ 自动刷新控制 ============ */
function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  const autoRefresh = document.getElementById('autoRefresh').checked;
  if (autoRefresh) {
    refreshTimer = setInterval(() => {
      fetchPriceData();
      fetchStatsData();
    }, refreshInterval);
  }
}

function updateRefreshInterval() {
  refreshInterval = parseInt(document.getElementById('refreshInterval').value);
  startAutoRefresh();
}

document.getElementById('autoRefresh').addEventListener('change', startAutoRefresh);

/* ============ 判断是否运行在 GitHub Pages / 纯静态环境：无后端 /api 可用 ============ */
function detectStaticMode() {
  const host = (location.hostname || '').toLowerCase();
  const path = (location.pathname || '/').toLowerCase();
  // 典型 GitHub Pages：xxx.github.io 域名，或路径包含 /ops-learning/（仓库名），或 /docs/
  if (
    host.endsWith('github.io') ||
    path.includes('/ops-learning/') ||
    path.startsWith('/docs/')
  ) return true;
  return false;
}

/* ============ 获取价格数据：优先真实API，失败自动降级纯静态内嵌生成器 ============ */
async function fetchPriceData() {
  setLoading(true);
  const refreshIcon = document.getElementById('refreshIcon');
  refreshIcon.style.animation = 'spin 1s linear infinite';

  let result = null;
  let usedStatic = false;
  const forceStatic = detectStaticMode();
  if (forceStatic) isStaticMode = true;

  if (!isStaticMode && !forceStatic) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const response = await fetch('/api/prices', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) result = await response.json();
    } catch (e) {
      isStaticMode = true;
    }
  }
  if (!result || !result.success) {
    isStaticMode = true;
    result = staticGenerator.prices();
    usedStatic = true;
  }

  try {
    if (result.success) {
      currentPriceData = result.data;
      updateStatsSummary(result);
      renderPriceList();
      updateFooterTime(result.lastUpdate);
      updateUpdateStatus('success', result.lastUpdate, usedStatic);
    } else {
      updateUpdateStatus('error');
      showError('获取价格数据失败: ' + result.message);
    }
  } finally {
    setLoading(false);
    refreshIcon.style.animation = 'none';
  }
}

/* ============ 获取统计数据：同上降级策略 ============ */
async function fetchStatsData() {
  let result = null;
  const forceStatic = detectStaticMode();
  if (forceStatic) isStaticMode = true;

  if (!isStaticMode && !forceStatic) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const response = await fetch('/api/stats', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) result = await response.json();
    } catch (e) {
      isStaticMode = true;
    }
  }
  if (!result || !result.success) {
    isStaticMode = true;
    result = staticGenerator.stats();
  }
  if (result.success) {
    currentStats = result.data;
    updateOverviewStats(currentStats);
    drawHistoryChart(currentStats.history);
  }
}

/* ============ 更新统计摘要 ============ */
function updateStatsSummary(data) {
  document.getElementById('statMinPrice').textContent = '¥' + data.minPrice;
  document.getElementById('statMaxPrice').textContent = '¥' + data.maxPrice;
  document.getElementById('statAvgPrice').textContent = '¥' + data.avgPrice;
  document.getElementById('statCount').textContent = data.totalCount + ' 条';
  document.getElementById('statAvgChange').innerHTML = '<span>📊</span> 基于 ' + data.totalCount + ' 条报价计算';
}

/* ============ 更新市场概览 ============ */
function updateOverviewStats(stats) {
  document.getElementById('todayLow').textContent = '¥' + stats.todayLow;
  document.getElementById('todayHigh').textContent = '¥' + stats.todayHigh;
  document.getElementById('todayOpen').textContent = '¥' + stats.todayOpen;
  document.getElementById('volume24h').textContent = formatNumber(stats.volume24h);
  document.getElementById('activeSellers').textContent = stats.activeSellers + ' 家';
  
  const changeEl = document.getElementById('priceChange');
  const change = parseFloat(stats.priceChange);
  if (change >= 0) {
    changeEl.textContent = '+' + change + '%';
    changeEl.className = 'overview-value positive';
  } else {
    changeEl.textContent = change + '%';
    changeEl.className = 'overview-value negative';
  }
}

/* ============ 渲染价格列表 ============ */
function renderPriceList() {
  const tbody = document.getElementById('priceTableBody');
  const platformFilter = document.getElementById('platformFilter').value;
  const sortBy = document.getElementById('sortBy').value;
  
  let data = [...currentPriceData];
  
  // 平台筛选
  if (platformFilter) {
    data = data.filter(item => item.platformName === platformFilter);
  }
  
  // 排序
  switch (sortBy) {
    case 'price-asc':
      data.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      data.sort((a, b) => b.price - a.price);
      break;
    case 'sold-desc':
      data.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case 'delivery-asc':
      data.sort((a, b) => a.deliveryTime - b.deliveryTime);
      break;
  }
  
  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" class="empty-cell">
          <div class="empty-icon">🔍</div>
          <p>暂无符合条件的报价数据</p>
          <p class="empty-sub">请尝试调整筛选条件</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = data.map((item, index) => {
    const isBestPrice = index === 0 && sortBy === 'price-asc';
    const trustColor = item.trustLevel === '高' ? 'trust-high' : 'trust-mid';
    
    return `
      <tr class="${isBestPrice ? 'best-price-row' : ''}">
        <td>
          <span class="rank-badge ${index < 3 ? 'rank-top' : ''}">${index + 1}</span>
          ${isBestPrice ? '<span class="best-tag">最优</span>' : ''}
        </td>
        <td>
          <div class="platform-cell">
            <span class="platform-icon">${item.platformIcon}</span>
            <span class="platform-name">${item.platformName}</span>
          </div>
        </td>
        <td class="price-cell">
          <span class="current-price">¥${item.price}</span>
          ${item.price < 970 ? '<span class="hot-tag">🔥</span>' : ''}
        </td>
        <td class="original-price-cell">
          <span class="original-price">¥${item.originalPrice}</span>
        </td>
        <td>
          <span class="discount-badge">${item.discount}折</span>
        </td>
        <td>
          <span class="seller-name">${item.seller}</span>
        </td>
        <td>
          <span class="trust-badge ${trustColor}">${item.trustLevel}</span>
        </td>
        <td>
          <span class="stock-num">${item.stock}</span>
        </td>
        <td>
          <span class="sold-num">${formatNumber(item.soldCount)}</span>
        </td>
        <td>
          <span class="delivery-time">约${item.deliveryTime}分钟</span>
        </td>
        <td>
          <span class="update-time">${formatTime(item.updateTime)}</span>
        </td>
        <td>
          <button class="btn-buy" onclick="handleBuy('${item.platformName}', ${item.price})">
            去购买
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/* ============ 绘制历史趋势图 ============ */
function drawHistoryChart(history) {
  const canvas = document.getElementById('historyChart');
  if (!canvas || !history || history.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('chartContainer');
  
  // 设置canvas尺寸
  const dpr = window.devicePixelRatio || 1;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 300 * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '300px';
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 计算数据范围
  const prices = history.flatMap(h => [h.low, h.high, h.avg]);
  const minPrice = Math.min(...prices) - 10;
  const maxPrice = Math.max(...prices) + 10;
  const priceRange = maxPrice - minPrice;
  
  // 绘制网格
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    // Y轴标签
    const price = maxPrice - (priceRange / 4) * i;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('¥' + Math.round(price), padding.left - 10, y + 4);
  }
  
  // X轴点位置
  const xStep = chartWidth / (history.length - 1);
  const xPoints = history.map((_, i) => padding.left + xStep * i);
  
  // 绘制X轴标签
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  history.forEach((h, i) => {
    const label = h.date.slice(5); // MM-DD
    ctx.fillText(label, xPoints[i], height - padding.bottom + 25);
  });
  
  // 绘制最高价-最低价区间
  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.beginPath();
  xPoints.forEach((x, i) => {
    const y = padding.top + chartHeight - ((history[i].high - minPrice) / priceRange) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  for (let i = history.length - 1; i >= 0; i--) {
    const x = xPoints[i];
    const y = padding.top + chartHeight - ((history[i].low - minPrice) / priceRange) * chartHeight;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  
  // 绘制平均线
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#8b5cf6');
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  xPoints.forEach((x, i) => {
    const y = padding.top + chartHeight - ((history[i].avg - minPrice) / priceRange) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // 绘制数据点
  xPoints.forEach((x, i) => {
    const y = padding.top + chartHeight - ((history[i].avg - minPrice) / priceRange) * chartHeight;
    
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 数值标签
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('¥' + history[i].avg, x, y - 12);
  });
  
  // 图例
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(width - padding.right - 180, 8, 16, 3);
  ctx.fillStyle = '#1f2937';
  ctx.fillText('平均价格', width - padding.right - 160, 14);
  
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.fillRect(width - padding.right - 90, 4, 16, 12);
  ctx.fillStyle = '#1f2937';
  ctx.fillText('价格区间', width - padding.right - 70, 14);
}

/* ============ 工具函数 ============ */
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}

function formatTime(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatFullTime(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function updateFooterTime(isoString) {
  document.getElementById('footerTime').textContent = formatFullTime(isoString);
}

function updateUpdateStatus(status, isoString, usedStatic) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('updateText');

  if (status === 'success') {
    dot.className = 'status-dot status-success';
    const suffix = (usedStatic || isStaticMode) ? ' · 📄 静态模式(GitHub Pages)' : '';
    text.textContent = '已更新 ' + formatTime(isoString) + suffix;
  } else if (status === 'error') {
    dot.className = 'status-dot status-error';
    text.textContent = '更新失败，请重试';
  } else {
    dot.className = 'status-dot status-pending';
    text.textContent = '更新中...';
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    updateUpdateStatus('pending');
  }
}

function showError(message) {
  console.error(message);
}

function handleBuy(platformName, price) {
  alert(`即将跳转到【${platformName}】购买农场币\n\n当前价格: ¥${price}\n\n(演示版本，实际购买需接入对应平台跳转链接)`);
}

/* ============ 响应式重绘图表 ============ */
window.addEventListener('resize', () => {
  if (currentStats && currentStats.history) {
    drawHistoryChart(currentStats.history);
  }
});
