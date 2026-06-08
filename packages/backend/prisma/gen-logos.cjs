const fs = require('fs')
const path = require('path')

const LOGO_DIR = path.join(__dirname, '../../../packages/frontend/public/logos')

const brands = [
  { file: 'iqiyi', label: '爱奇艺', sub: 'iQIYI', bg: '#00BE06', text: '#fff' },
  { file: 'youku', label: '优酷', sub: 'YOUKU', bg: '#1EBCF2', text: '#fff' },
  { file: 'tencentvideo', label: '腾讯视频', sub: 'Tencent Video', bg: '#FF6A10', text: '#fff' },
  { file: 'mgtv', label: '芒果TV', sub: 'MGTV', bg: '#FF7F00', text: '#fff' },
  { file: 'bilibili', label: 'bilibili', sub: '哔哩哔哩', bg: '#FB7299', text: '#fff' },
  { file: 'qqmusic', label: 'QQ音乐', sub: 'QQ Music', bg: '#31C27C', text: '#fff' },
  { file: 'neteasemusic', label: '网易云', sub: 'NetEase Music', bg: '#C20C0C', text: '#fff' },
  { file: 'kugou', label: '酷狗音乐', sub: 'KuGou', bg: '#2CA2F9', text: '#fff' },
  { file: 'wps', label: 'WPS', sub: 'Office', bg: '#D4382E', text: '#fff' },
  { file: 'baidupan', label: '百度网盘', sub: 'Baidu Netdisk', bg: '#06A5FF', text: '#fff' },
  { file: 'alipan', label: '阿里云盘', sub: 'Aliyun Drive', bg: '#4F46E5', text: '#fff' },
  { file: 'keep', label: 'Keep', sub: '自律给我自由', bg: '#35D0BA', text: '#fff' },
  { file: 'meituan', label: '美团', sub: 'Meituan', bg: '#FFD000', text: '#222' },
  { file: 'didi', label: '滴滴出行', sub: 'DiDi', bg: '#FF6611', text: '#fff' },
]

function generateSvg(brand) {
  const mainSize = brand.label.length <= 3 ? 72 : brand.label.length <= 5 ? 56 : 48
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg-${brand.file}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${brand.bg}"/>
      <stop offset="100%" style="stop-color:${adjustColor(brand.bg, -30)}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="64" fill="url(#bg-${brand.file})"/>
  <text x="200" y="190" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="${mainSize}" font-weight="700" fill="${brand.text}" dominant-baseline="middle">${brand.label}</text>
  <text x="200" y="260" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="24" fill="${brand.text}" opacity="0.7">${brand.sub}</text>
</svg>`
}

function adjustColor(hex, amount) {
  hex = hex.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

// Clean old SVGs
const existing = fs.readdirSync(LOGO_DIR)
existing.forEach(f => fs.unlinkSync(path.join(LOGO_DIR, f)))

for (const brand of brands) {
  const svg = generateSvg(brand)
  fs.writeFileSync(path.join(LOGO_DIR, `${brand.file}.svg`), svg)
  console.log(`✅ ${brand.file}.svg`)
}

console.log('All logos generated!')
