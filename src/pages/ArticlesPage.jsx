import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { getAllPosts, getAllTags } from '../utils/loadPosts'

const ACCENT_COLORS = [
  'text-forest-400', 'text-sky-400', 'text-amber-400', 'text-violet-400',
  'text-rose-400',   'text-cyan-400',
]

export default function ArticlesPage() {
  const allPosts = useMemo(() => getAllPosts(), [])
  const tags     = useMemo(() => getAllTags(), [])
  const fuse     = useMemo(() => new Fuse(allPosts, {
    keys: ['title', 'excerpt', 'tags'],
    threshold: 0.35,
  }), [allPosts])

  const [query,      setQuery]      = useState('')
  const [activeTag,  setActiveTag]  = useState(null)

  const results = useMemo(() => {
    let base = query ? fuse.search(query).map(r => r.item) : allPosts
    if (activeTag) base = base.filter(p => p.tags.includes(activeTag))
    return base
  }, [query, activeTag, allPosts, fuse])

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">所有文章</p>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-6">文章列表</h1>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="搜尋文章標題、標籤…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-forest-600 transition-colors"
            />
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !activeTag ? 'bg-forest-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              全部
            </button>
            {tags.map(({ name }) => (
              <button
                key={name}
                onClick={() => setActiveTag(activeTag === name ? null : name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTag === name ? 'bg-forest-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-16">找不到符合的文章</p>
        ) : (
          <ul className="flex flex-col divide-y divide-slate-800/60">
            {results.map((post, i) => (
              <li key={post.slug}>
                <Link
                  to={`/posts/${post.slug}`}
                  className="group flex gap-4 py-5 hover:bg-slate-900/40 -mx-3 px-3 rounded-xl transition-colors"
                >
                  <div className={`hidden sm:flex flex-shrink-0 mt-1 text-lg font-mono font-bold w-8 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} opacity-40 group-hover:opacity-80 transition-opacity`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {post.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-forest-900/60 text-forest-400 border border-forest-800/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-slate-200 font-semibold group-hover:text-forest-400 transition-colors leading-snug mb-1">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-slate-600 mt-2">
                      {new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <svg className="flex-shrink-0 self-center w-4 h-4 text-slate-600 group-hover:text-forest-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-slate-600 text-center mt-8">{results.length} 篇文章</p>
      </div>
    </div>
  )
}
