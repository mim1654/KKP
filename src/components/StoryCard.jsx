import { TrashIcon } from './Icons.jsx'

const TILTS = [-0.8, 0.6, -0.5, 0.9, -0.3]

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
  const delay = (index % 8) * 0.06

  function handleDelete() {
    if (window.confirm('Hapus cerita ini?')) {
      onDelete?.(story)
    }
  }

  return (
    <div className="story-card" style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}s` }}>
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
