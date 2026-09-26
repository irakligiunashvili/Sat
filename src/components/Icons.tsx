import type { CategoryId } from '../types'

const inner: Record<CategoryId, string> = {
  wine: '<path fill="currentColor" d="M8 2.2h8c-.2 2.5-.6 4.4-1.1 5.8A3.5 3.5 0 0 1 12 11.3 3.5 3.5 0 0 1 9.1 8C8.6 6.6 8.2 4.7 8 2.2zm3.05 9.3h1.9V17h2.45v1.9H8.6V17h2.45v-5.5z"/>',
  vegetables:
    '<path fill="#3f7d4e" d="M12.2 8.6c.4-2.8 2-5 4-6-.9 2.4-.2 4 .9 5-1.8.4-3.4.7-4.9 1z"/><path fill="#5d9a48" d="M11.4 8.4C10.6 5.8 8.4 4 6.2 3.8c1.2 2.4 1.6 3.8.6 5 1.5.1 3 .4 4.6.6z"/><path fill="#e07a2f" d="M13.1 8.2c-2.6.2-5.6 3.4-6 8.6-.3 3.8 1.1 6 3 6.3 2.2.4 4.6-.8 5.6-2.8 1.4-3 1.3-7.2-.4-10-1-1.4-1.4-2-2.2-2.1z"/>',
  fruit: '<path fill="#3f7d4e" d="M13.1 4.3c1.1-1 2.4-1.4 3.4-1.3-.4 1.4-1.2 2.3-2.3 2.8-.4.1-.8.2-1.1.2V4.3z"/><path fill="#c45a32" d="M11.55 5.2h1.2V8h-1.2z"/><path fill="#d4533c" d="M12 8.2c-2.9.1-5.2 2.4-5.2 5.3 0 3.3 2.3 5.8 5.2 5.8s5.2-2.5 5.2-5.8c0-2.8-2-5.1-4.4-5.3h-.8z"/>',
  cheese:
    '<path fill="#e0b15a" fill-rule="evenodd" d="M3.4 18.6 12 5.1l8.6 13.5H3.4zM8.7 15.5a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0zm4.5-2.7a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0z"/>',
  bread: '<path fill="#c47a45" d="M5.4 13.1C5.4 9.6 8 7.2 12 7.2s6.6 2.4 6.6 5.9V19H5.4v-5.9z"/>',
  honey:
    '<path fill="#e0a106" fill-rule="evenodd" d="m12 2.4 4.4 2.6v5.1L12 12.7 7.6 10.1V5L12 2.4zm0 2.5L10.1 6.3v2.6L12 10.3l1.9-1.4V6.3L12 4.9z"/><path fill="#c4840a" d="M11.15 13.2h1.7l-.35 3.4c-.15.9-.3 1.6-.5 2.5-.2-.9-.35-1.6-.5-2.5l-.35-3.4z"/>',
  preserves:
    '<path fill="#8d4d38" d="M8.2 5.2h7.6v2.3H8.2z"/><path fill="#c45a3c" d="M7.3 8.8h9.4v9.6a1.8 1.8 0 0 1-1.8 1.8H9.1a1.8 1.8 0 0 1-1.8-1.8V8.8z"/><circle cx="12" cy="13.6" r="1.7" fill="#f3d2b0"/>',
  herbs: '<path fill="none" stroke="#3f7d4e" stroke-width="1.7" stroke-linecap="round" d="M12 21V9.5"/><path fill="#3f7d4e" d="M12 16.2c-2.8-.8-5-2.8-5-5 2 .2 3.6 1.3 5 3.1 1.4-1.8 3-2.9 5-3.1 0 2.2-2.2 4.2-5 5z"/><path fill="#6e8f4e" d="M12 11.6C9.8 11 8.2 9.2 7.8 7.2c1.8.5 3.1 1.6 4.2 3 1.1-1.4 2.4-2.5 4.2-3-.4 2-1.8 3.8-4.2 4.4z"/>',
}

export function categorySvg(id: CategoryId) {
  return `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">${inner[id]}</svg>`
}

export function CategoryIcon({ id }: { id: CategoryId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="cat-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner[id] }}
    />
  )
}
