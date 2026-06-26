import { Link } from 'react-router-dom'

const GRADIENTS = [
  'from-forest-900 via-slate-900 to-slate-950',
  'from-slate-900 via-slate-850 to-slate-950',
]
const ACCENTS = [
  'text-forest-400', 'text-sky-400', 'text-amber-400', 'text-violet-400',
]

function getStyle(index = 0) {
  return {
    gradient: GRADIENTS[index % GRADIENTS.length],
    accent:   ACCENTS[index % ACCENTS.length],
  }
}

export default function PostCard({ post, large = false, index = 0 }) {
  const { slug, title, excerpt, tags, date } = post
  const { gradient, accent } = getStyle(index)

  const formattedDate = new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  if (large) {
    return (
      <Link to={`/posts/${slug}`} className="card group cursor-pointer block animate-slide-up">
        <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${gradient} flex items-end p-6`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 20% 50%, rgba(45,153,96,0.4) 0%, transparent 60%)` }}
          />
          <div className="relative flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-forest-900/60 text-forest-400 border border-forest-800/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-6">
          <h2 className={`text-xl font-semibold text-slate-100 group-hover:${accent} transition-colors duration-200 mb-3 leading-snug`}>
            {title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">{excerpt}</p>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{formattedDate}</span>
            <span className="text-forest-500 group-hover:text-forest-400 transition-colors">閱讀全文 →</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/posts/${slug}`} className="card group cursor-pointer p-5 flex gap-4 animate-slide-up">
      <div className={`hidden sm:flex flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} items-center justify-center`}>
        <svg className={`w-7 h-7 ${accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-forest-900/60 text-forest-400 border border-forest-800/80">
              {tag}
            </span>
          ))}
        </div>
        <h3 className={`text-sm font-semibold text-slate-200 group-hover:${accent} transition-colors duration-200 mb-1 leading-snug`}>
          {title}
        </h3>
        <p className="text-xs text-slate-500">{formattedDate}</p>
      </div>
    </Link>
  )
}
