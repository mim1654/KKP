import { Link } from 'react-router-dom'

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

export default function PhotoCard({ photo }) {
  const storyCount = photo.stories?.[0]?.count ?? 0

  return (
    <Link to={`/foto/${photo.id}`} className="photo-card">
      <img src={photo.image_url} alt={photo.title || 'Kenangan'} />
      <div className="photo-card-body">
        <h3 className="photo-card-title">{photo.title || 'Tanpa judul'}</h3>
        <div className="photo-card-meta">
          <span>
            diunggah oleh {photo.uploader_name}
            {photo.event_date ? ` · ${formatDate(photo.event_date)}` : ''}
          </span>
          <span className="photo-card-count">
            {storyCount} {storyCount === 1 ? 'cerita' : 'cerita'}
          </span>
        </div>
      </div>
    </Link>
  )
}
