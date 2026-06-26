import { useMemo } from 'react'

export function useTOC(markdown) {
  return useMemo(() => {
    const lines = markdown.split('\n')
    const headings = []
    for (const line of lines) {
      const m = line.match(/^(#{2,3})\s+(.+)/)
      if (!m) continue
      const level = m[1].length
      const text  = m[2].trim()
      const id    = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
      headings.push({ level, text, id })
    }
    return headings
  }, [markdown])
}
