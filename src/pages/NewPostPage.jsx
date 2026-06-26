import { useState, useCallback, useRef } from 'react'
import MarkdownRenderer from '../components/MarkdownRenderer'

const TODAY = new Date().toISOString().slice(0, 10)

const TEMPLATE = `## 前言

在這裡寫你的文章內容...

## 第一節

支援 **粗體**、*斜體*、\`inline code\`。

\`\`\`js
// 程式碼區塊
console.log('Hello World')
\`\`\`

## 結論

總結你的觀點。
`

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputCls = `w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm
  placeholder-slate-600 focus:outline-none focus:border-forest-600 transition-colors`

export default function NewPostPage() {
  const [title,        setTitle]        = useState('')
  const [date,         setDate]         = useState(TODAY)
  const [tagsRaw,      setTagsRaw]      = useState('')
  const [excerpt,      setExcerpt]      = useState('')
  const [content,      setContent]      = useState(TEMPLATE)
  const [tab,          setTab]          = useState('edit')
  const [saved,        setSaved]        = useState(false)
  const [imgList,      setImgList]      = useState([]) // { name, previewUrl }
  const textareaRef = useRef(null)
  const imgInputRef = useRef(null)

  const handleImagePick = useCallback((e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file)
      setImgList(prev => {
        if (prev.find(i => i.name === file.name)) return prev
        return [...prev, { name: file.name, previewUrl }]
      })
    })
    e.target.value = ''
  }, [])

  const insertImageMd = useCallback((name) => {
    const md = `![圖片描述](images/${name})`
    const ta = textareaRef.current
    if (!ta) { setContent(c => c + '\n' + md); return }
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    setContent(c => c.slice(0, start) + '\n' + md + '\n' + c.slice(end))
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + md.length + 2
      ta.focus()
    }, 0)
  }, [])

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .slice(0, 60) || 'untitled'

  const tags = tagsRaw
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(Boolean)

  const frontmatter = `---
title: ${title || '無標題'}
date: ${date}
tags: [${tags.join(', ')}]
excerpt: ${excerpt}
---
`

  const fullMarkdown = frontmatter + '\n' + content

  const handleDownload = useCallback(() => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${slug}.md`
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [fullMarkdown, slug])

  const isReady = title.trim().length > 0

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-16">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-forest-500 flex-shrink-0" />
            <span className="text-sm text-slate-400 truncate">
              {title || '未命名文章'}
            </span>
            <span className="hidden sm:inline text-xs text-slate-600 font-mono flex-shrink-0">
              → {slug}.md
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile tab toggle */}
            <div className="flex sm:hidden rounded-lg border border-slate-700 overflow-hidden text-xs">
              {['edit', 'preview'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    tab === t ? 'bg-forest-800 text-forest-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t === 'edit' ? '編輯' : '預覽'}
                </button>
              ))}
            </div>

            <button
              onClick={handleDownload}
              disabled={!isReady}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                saved
                  ? 'bg-forest-600 text-white'
                  : isReady
                    ? 'bg-forest-700 hover:bg-forest-600 text-white shadow-lg shadow-forest-950/50'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {saved ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  已下載
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  下載 .md
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-5">
        {/* Metadata fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <Field label="標題 *">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="文章標題"
              className={inputCls}
            />
          </Field>
          <Field label="日期">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="標籤（逗號分隔）">
            <input
              type="text"
              value={tagsRaw}
              onChange={e => setTagsRaw(e.target.value)}
              placeholder="React, TypeScript, 效能"
              className={inputCls}
            />
          </Field>
          <Field label="摘要">
            <input
              type="text"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="一句話描述這篇文章"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Tag preview */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 -mt-2 px-1">
            {tags.map(t => (
              <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-900/60 text-forest-400 border border-forest-800/80">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Image picker */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">照片</p>
            <button
              onClick={() => imgInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              選擇圖片
            </button>
            <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
          </div>
          {imgList.length === 0 ? (
            <p className="text-xs text-slate-600 italic">選擇圖片後，點「插入」自動貼入 Markdown；記得把圖片檔案複製到 <code className="font-mono text-forest-600">public/images/</code></p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {imgList.map(({ name, previewUrl }) => (
                <div key={name} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                  <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <button
                      onClick={() => insertImageMd(name)}
                      className="text-[10px] font-bold text-forest-300 hover:text-white px-2 py-0.5 rounded bg-forest-800/80 transition-colors"
                    >
                      插入
                    </button>
                    <button
                      onClick={() => setImgList(l => l.filter(i => i.name !== name))}
                      className="text-[10px] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      移除
                    </button>
                  </div>
                  <p className="absolute bottom-0 inset-x-0 text-[9px] text-slate-400 bg-slate-900/80 px-1 truncate">{name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor / Preview panes */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[500px]">
          {/* Editor */}
          <div className={`flex flex-col ${tab === 'preview' ? 'hidden sm:flex' : 'flex'}`}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Markdown 編輯</span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full px-4 py-4 rounded-xl bg-slate-900 border border-slate-800
                         text-slate-300 text-sm font-mono leading-7 resize-none
                         focus:outline-none focus:border-forest-700 transition-colors
                         placeholder-slate-600"
              placeholder="開始撰寫 Markdown 內容…"
            />
          </div>

          {/* Preview */}
          <div className={`flex flex-col ${tab === 'edit' ? 'hidden sm:flex' : 'flex'}`}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">即時預覽</span>
            </div>
            <div className="flex-1 px-6 py-5 rounded-xl bg-slate-900 border border-slate-800 overflow-y-auto">
              {title && (
                <div className="mb-6 pb-5 border-b border-slate-800">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-forest-900/60 text-forest-400 border border-forest-800/80">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-100 leading-tight mb-2">{title}</h1>
                  {date && <p className="text-xs text-slate-500">{new Date(date + 'T00:00:00').toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                </div>
              )}
              <MarkdownRenderer content={content} />
              {!content.trim() && (
                <p className="text-slate-600 text-sm italic">在左側開始輸入 Markdown…</p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-forest-950/40 border border-forest-900/50 text-xs text-slate-500">
          <svg className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <span>
            撰寫完成後點「下載 .md」，將檔案移至專案的 <code className="font-mono text-forest-500 bg-forest-950 px-1 rounded">src/posts/</code> 資料夾，Vite 會自動偵測並更新。
          </span>
        </div>
      </div>
    </div>
  )
}
