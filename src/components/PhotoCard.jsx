import { Link } from 'react-router-dom'
import { TrashIcon } from './Icons.jsx'

const TILTS = [-1.6, 1.1, -0.7, 1.8, -1.1, 0.6, -0.4, 1.4]

function formatDate(value) {
  if (!value) return ''
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

export default function PhotoCard({ photo, index, isAdmin, onDelete }) {
  const storyCount = photo.stories?.[0]?.count ?? 0
  const tilt = TILTS[index % TILTS.length]
  const delay = (index % 9) * 0.07

  function handleDeleteClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Hapus foto ini beserta semua ceritanya? Tidak bisa dibatalkan.')) {
      onDelete?.(photo)
    }
  }

  return (
    <Link
      to={`/foto/${photo.id}`}
      className="photo-tile"
      style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}s` }}
    >
      <div className="tile-tape" />
      <img src={photo.image_url} alt={photo.title || 'Kenangan'} loading="lazy" />
      <div className="tile-overlay">
        <h3 className="tile-title">{photo.title || 'Tanpa judul'}</h3>
        <div className="tile-meta">
          <span>
            {photo.uploader_name}
            {photo.event_date ? ` · ${formatDate(photo.event_date)}` : ''}
          </span>
          <span className="tile-count">{storyCount} cerita</span>
        </div>
      </div>
      {isAdmin && (
        <button
          className="tile-delete"
          onClick={handleDeleteClick}
          title="Hapus foto ini"
          aria-label="Hapus foto ini"
        >
          <TrashIcon />
        </button>
      )}
    </Link>
  )
}
