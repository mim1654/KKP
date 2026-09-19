import { TrashIcon } from './Icons.jsx'

const TILTS = [-1.2, 0.9, -0.7, 1.3, -0.5]
const SLIDES = ['-14px', '14px', '-10px', '12px', '-8px']
const COLORS = ['#2ec4b6', '#ff6b6b', '#a06cd5', '#ffc93c', '#ff8fab']

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

export default function StoryCard({ story, index, isAdmin, onDelete }) {
  const tilt = TILTS[index % TILTS.length]
  const slide = SLIDES[index % SLIDES.length]
  const delay = (index % 8) * 0.07
  const color = COLORS[index % COLORS.length]

  function handleDelete() {
    if (window.confirm('Hapus cerita ini?')) {
      onDelete?.(story)
    }
  }

  return (
    <div
      className="story-card"
      style={{ '--tilt': `${tilt}deg`, '--slide': slide, '--delay': `${delay}s`, '--tile-color': color }}
    >
      <p className="story-content">{story.content}</p>
      <div className="story-footer">
        <span className="story-author">— {story.author_name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="story-date">{formatDate(story.created_at)}</span>
          {isAdmin && (
            <button
              className="story-delete"
              onClick={handleDelete}
              title="Hapus cerita ini"
              aria-label="Hapus cerita ini"
            >
              <TrashIcon width={14} height={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
