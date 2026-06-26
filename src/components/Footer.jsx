export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-forest-700 flex items-center justify-center text-white text-xs font-bold">B</span>
          <span className="text-xs text-slate-500">© 2026 Blog.dev · 以 React + Tailwind 打造</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-slate-600">
          {['RSS', 'GitHub', 'Twitter'].map(l => (
            <a key={l} href="#" className="hover:text-forest-400 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
