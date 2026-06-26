import { useMemo, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getAllPosts, getPostBySlug } from '../utils/loadPosts'
import { useReadingProgress } from '../hooks/useReadingProgress'
import { useTOC } from '../hooks/useTOC'
import MarkdownRenderer from '../components/MarkdownRenderer'
import GiscusComments from '../components/GiscusComments'

export default function PostPage() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const post        = useMemo(() => getPostBySlug(slug), [slug])
  const allPosts    = useMemo(() => getAllPosts(), [])
  const progress    = useReadingProgress()
  const toc         = useTOC(post?.content ?? '')
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    if (!post) navigate('/articles', { replace: true })
    window.scrollTo(0, 0)
  }, [post, slug, navigate])

  if (!post) return null

  const idx      = allPosts.findIndex(p => p.slug === slug)
  const prevPost = allPosts[idx + 1] ?? null
  const nextPost = allPosts[idx - 1] ?? null

  const formattedDate = new Date(post.date).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const wordCount   = post.content.replace(/```[\s\S]*?```/g, '').replace(/[^一-龥\w]/g, '').length
  const readMinutes = Math.max(1, Math.ceil(wordCount / 300))

  return (
    <>
      <Helmet>
        <title>{post.title} — Blog.dev</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title"       content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type"        content="article" />
        <meta property="article:published_time" content={post.date} />
        {post.tags.map(t => <meta key={t} property="article:tag" content={t} />)}
      </Helmet>

      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-forest-600 to-forest-400 z-[60] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />

      <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-10 items-start">

            {/* Main content */}
            <div className="min-w-0">
              <Link
                to="/articles"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-forest-400 transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
                文章列表
              </Link>

              <header className="mb-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/articles?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-900/60 text-forest-400 border border-forest-800/80 hover:bg-forest-800/60 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight tracking-tight mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>{formattedDate}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    約 {readMinutes} 分鐘
                  </span>
                  <ShareButton title={post.title} />
                </div>
              </header>

              {/* Mobile TOC toggle */}
              {toc.length > 0 && (
                <div className="lg:hidden mb-6">
                  <button
                    onClick={() => setTocOpen(v => !v)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-forest-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                    </svg>
                    目錄 {tocOpen ? '▲' : '▼'}
                  </button>
                  {tocOpen && (
                    <nav className="mt-3 pl-3 border-l border-slate-800 flex flex-col gap-1">
                      {toc.map(({ id, text, level }) => (
                        <a
                          key={id}
                          href={`#${id}`}
                          onClick={() => setTocOpen(false)}
                          className={`text-sm text-slate-400 hover:text-forest-400 transition-colors ${level === 3 ? 'pl-3' : ''}`}
                        >
                          {text}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              )}

              <div className="border-t border-slate-800 mb-10" />

              <MarkdownRenderer content={post.content} />

              {/* Prev / Next */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link to={`/posts/${prevPost.slug}`}
                    className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-800 hover:border-forest-700 transition-colors">
                    <span className="text-xs text-slate-500">← 上一篇</span>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-forest-400 transition-colors line-clamp-2">{prevPost.title}</span>
                  </Link>
                ) : <div />}
                {nextPost && (
                  <Link to={`/posts/${nextPost.slug}`}
                    className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-800 hover:border-forest-700 transition-colors text-right">
                    <span className="text-xs text-slate-500">下一篇 →</span>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-forest-400 transition-colors line-clamp-2">{nextPost.title}</span>
                  </Link>
                )}
              </div>

              {/* Comments */}
              <div className="mt-12">
                <GiscusComments />
              </div>
            </div>

            {/* TOC sidebar */}
            {toc.length > 0 && (
              <aside className="hidden lg:block sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">目錄</p>
                <nav className="flex flex-col gap-1">
                  {toc.map(({ id, text, level }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`text-sm text-slate-500 hover:text-forest-400 transition-colors leading-snug py-0.5
                        ${level === 3 ? 'pl-3 text-xs' : 'font-medium'}`}
                    >
                      {text}
                    </a>
                  ))}
                </nav>
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xs text-slate-600 hover:text-forest-400 transition-colors flex items-center gap-1"
                  >
                    ↑ 回頂部
                  </button>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function ShareButton({ title }) {
  const [shared, setShared] = useState(false)

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-1 text-slate-500 hover:text-forest-400 transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
      {shared ? '已複製連結' : '分享'}
    </button>
  )
}
