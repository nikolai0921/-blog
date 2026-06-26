import { useEffect, useRef } from 'react'

// 設定說明：
// 1. 到 https://giscus.app 填入你的 GitHub repo
// 2. 把下方 GISCUS_* 換成網站給你的值
// 3. 確保 repo 已開啟 Discussions 功能

const GISCUS_REPO        = 'nikolai0921/-blog'
const GISCUS_REPO_ID     = 'R_kgDOTEnTTA'
const GISCUS_CATEGORY    = 'Announcements'
const GISCUS_CATEGORY_ID = 'DIC_kwDOTEnTTM4C_2O9'

export default function GiscusComments() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src              = 'https://giscus.app/client.js'
    script.setAttribute('data-repo',            GISCUS_REPO)
    script.setAttribute('data-repo-id',         GISCUS_REPO_ID)
    script.setAttribute('data-category',        GISCUS_CATEGORY)
    script.setAttribute('data-category-id',     GISCUS_CATEGORY_ID)
    script.setAttribute('data-mapping',         'pathname')
    script.setAttribute('data-strict',          '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata',   '0')
    script.setAttribute('data-input-position',  'top')
    script.setAttribute('data-theme',           'dark')
    script.setAttribute('data-lang',            'zh-TW')
    script.setAttribute('data-loading',         'lazy')
    script.crossOrigin = 'anonymous'
    script.async       = true

    ref.current.appendChild(script)
  }, [])

  const isConfigured = !GISCUS_REPO.includes('your-github')

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
        <p className="text-sm text-slate-500 mb-2">留言系統尚未設定</p>
        <p className="text-xs text-slate-600">
          前往{' '}
          <a href="https://giscus.app" target="_blank" rel="noreferrer"
            className="text-forest-500 hover:text-forest-400 underline">
            giscus.app
          </a>{' '}
          取得你的 repo 設定，填入{' '}
          <code className="font-mono text-xs text-forest-500 bg-forest-950 px-1 rounded">
            src/components/GiscusComments.jsx
          </code>
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">留言</p>
      <div ref={ref} />
    </div>
  )
}
