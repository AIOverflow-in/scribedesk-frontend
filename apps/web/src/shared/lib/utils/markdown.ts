export function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*-\s+/gm, '• ')
    .trim()
}

export function markdownToHtml(text: string): string {
  let html = text
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+$/gm, '')
  html = html.replace(/^### (.+)$/gm, '<h3 style="margin: 16px 0 8px">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 style="margin: 20px 0 8px">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h2 style="margin: 20px 0 8px">$1</h2>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>')
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul style="margin: 8px 0">$1</ul>')
  html = html.replace(/\n{3,}/g, '\n\n')
  html = html.split('\n\n').filter(Boolean).map(p => p.trim()).map(p => {
    if (p.startsWith('<h') || p.startsWith('<ul')) return p
    return `<p style="margin: 8px 0">${p}</p>`
  }).join('\n')
  return html
}
