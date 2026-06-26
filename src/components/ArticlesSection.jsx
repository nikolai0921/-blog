import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts, getAllTags } from '../utils/loadPosts'
import PostCard from './PostCard'

export default function ArticlesSection() {
  const allPosts = useMemo(() => getAllPosts(), [])
  const allTags  = useMemo(() => getAllTags().slice(0, 5).map(t => t.name), [])
  const FILTERS  = ['全部', ...allTags]

  const [active, setActive] = useState('全部')

  const filtered = active === '全部'
    ? allPosts
    : allPosts.filter(p => p.tags.includes(active))

  const [featured, ...rest] = filtered

  return (
    <section id="articles" className="pb-20">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">精選文章</p>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">最新技術分享</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
                  active === f
                    ? 'bg-forest-700 text-white shadow-md shadow-forest-900/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-slate-500 text-sm py-12 text-center">此分類暫無文章</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured && (
              <div className="sm:col-span-2 lg:col-span-2">
                <PostCard post={featured} large />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {rest.slice(0, 2).map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {rest.slice(2).map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-700 hover:border-forest-700 text-slate-400 hover:text-forest-400 text-sm font-medium transition-all duration-200"
          >
            查看所有文章
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
