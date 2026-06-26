// Vite: import all .md files under src/posts/ as raw strings
const mdModules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })

function slugFromPath(path) {
  return path.replace(/^.*\//, '').replace(/\.md$/, '')
}

// Minimal browser-safe frontmatter parser — supports string, array, and date values
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/)
  if (!match) return { data: {}, content: raw }

  const data = {}
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':')
    if (colon === -1) return
    const key   = line.slice(0, colon).trim()
    const raw   = line.slice(colon + 1).trim()

    if (raw.startsWith('[') && raw.endsWith(']')) {
      data[key] = raw.slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      data[key] = raw.replace(/^['"]|['"]$/g, '')
    }
  })

  return { data, content: match[2] }
}

export function getAllPosts() {
  return Object.entries(mdModules)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      return {
        slug:    slugFromPath(path),
        title:   data.title   ?? '無標題',
        date:    data.date    ?? '',
        tags:    Array.isArray(data.tags) ? data.tags : [],
        excerpt: data.excerpt ?? '',
        content,
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  return getAllPosts().find(p => p.slug === slug) ?? null
}

export function getAllTags() {
  const counts = {}
  getAllPosts().forEach(p =>
    p.tags.forEach(t => { counts[t] = (counts[t] ?? 0) + 1 })
  )
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
