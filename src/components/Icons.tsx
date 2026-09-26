import type { CategoryId } from '../types'

const emoji: Record<CategoryId, string> = {
  wine: '🍷',
  vegetables: '🥕',
  fruit: '🍎',
  cheese: '🧀',
  bread: '🍞',
  honey: '🍯',
  preserves: '🫙',
  herbs: '🌿',
}

export function categorySvg(id: CategoryId) {
  return `<span class="pin-emoji" aria-hidden="true">${emoji[id]}</span>`
}

export function CategoryIcon({ id }: { id: CategoryId }) {
  return (
    <span className="cat-icon" aria-hidden="true">
      {emoji[id]}
    </span>
  )
}
