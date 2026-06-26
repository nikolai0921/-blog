import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(45,153,96,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(45,153,96,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-forest-400 animate-pulse" />
            <span className="text-xs font-mono text-forest-400 tracking-wider">ACTIVE · 持續更新中</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 leading-[1.1] tracking-tight mb-6">
            探索程式
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 to-forest-300">
              的無限可能
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
            記錄生活及平時學習AI CODE歷程
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-600 hover:bg-forest-500 text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-forest-900/50"
            >
              瀏覽文章
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-700 hover:border-forest-700 text-slate-300 hover:text-forest-400 font-medium text-sm transition-all duration-200"
            >
              關於我
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-8">
          {[
            { value: '4',    label: '篇技術文章' },
            { value: '3.2k', label: '月讀者'     },
            { value: '12',   label: '個開源專案' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span className="text-2xl font-bold text-forest-400">{value}</span>
              <span className="text-xs text-slate-500 mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
