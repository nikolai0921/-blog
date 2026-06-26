import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <button
      onClick={copy}
      title="複製程式碼"
      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md
                 bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white
                 text-[11px] font-medium transition-all duration-150 opacity-0 group-hover:opacity-100"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          已複製
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          複製
        </>
      )}
    </button>
  )
}

const components = {
  pre({ children, ...props }) {
    const codeEl   = children?.props
    const codeText = codeEl?.children ?? ''
    const lang     = (codeEl?.className ?? '').replace('language-', '')

    return (
      <div className="relative group my-5">
        {lang && (
          <span className="absolute top-3 left-4 text-[11px] font-mono text-slate-500 select-none">
            {lang}
          </span>
        )}
        <CopyButton code={typeof codeText === 'string' ? codeText : String(codeText)} />
        <pre {...props} className={`${props.className ?? ''} pt-8`}>
          {children}
        </pre>
      </div>
    )
  },

  img({ src, alt }) {
    return (
      <figure className="my-6">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full rounded-xl border border-slate-800 object-cover"
        />
        {alt && (
          <figcaption className="text-center text-xs text-slate-500 mt-2 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },

  h2({ children }) {
    const text = String(children)
    const id   = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
    return <h2 id={id}>{children}</h2>
  },

  h3({ children }) {
    const text = String(children)
    const id   = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
    return <h3 id={id}>{children}</h3>
  },
}

export default function MarkdownRenderer({ content }) {
  return (
    <article className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
