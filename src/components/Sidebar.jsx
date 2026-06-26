import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllTags } from '../utils/loadPosts'

const ACTIVITY = [
  { type: 'post',    label: '發佈了新文章',   time: '3 天前' },
  { type: 'project', label: '開源了 CLI 工具', time: '1 週前' },
  { type: 'note',    label: '更新了閱讀筆記', time: '2 週前' },
]

const ACTIVITY_PATHS = {
  post:    'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
  project: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  note:    'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
}

function Widget({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">{title}</p>
      {children}
    </div>
  )
}

export default function Sidebar() {
  const tags = useMemo(() => getAllTags(), [])

  return (
    <aside className="flex flex-col gap-5">
      {/* About */}
      <Widget title="關於作者">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-700 to-forest-900 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            F
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Farcos</p>
            <p className="text-xs text-slate-500">後端工程師 · 開源愛好者</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          熱愛系統設計與效能調優，相信好的工程文化能改變世界。目前在台北某新創擔任 Staff Engineer。
        </p>
        <div className="flex gap-2">
          <Link to="/about" className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:border-forest-700 hover:text-forest-400 transition-colors">
            關於我
          </Link>
          <a href="#" className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:border-forest-700 hover:text-forest-400 transition-colors">
            GitHub
          </a>
        </div>
      </Widget>

      {/* Tags */}
      <Widget title="熱門標籤">
        <div className="flex flex-wrap gap-2">
          {tags.map(({ name, count }) => (
            <Link
              key={name}
              to={`/articles?tag=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-950 text-forest-400 border border-forest-800 hover:bg-forest-900 hover:text-forest-300 transition-colors"
            >
              {name}
              <span className="opacity-60">{count}</span>
            </Link>
          ))}
        </div>
      </Widget>

      {/* Activity */}
      <Widget title="最近動態">
        <ul className="flex flex-col gap-3">
          {ACTIVITY.map(({ type, label, time }, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-7 h-7 rounded-lg bg-forest-950 border border-forest-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ACTIVITY_PATHS[type]} />
                </svg>
              </span>
              <div>
                <p className="text-xs text-slate-300">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Widget>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-forest-900/60 to-slate-900 border border-forest-800/50 rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">電子報</p>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">每兩週收到最新文章與精選技術資源，直送信箱。</p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:border-forest-600 mb-2.5 transition-colors"
        />
        <button className="w-full py-2 rounded-lg bg-forest-700 hover:bg-forest-600 text-white text-xs font-semibold transition-colors">
          立即訂閱
        </button>
      </div>
    </aside>
  )
}
