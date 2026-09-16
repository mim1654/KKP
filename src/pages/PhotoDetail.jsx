import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StoryCard from '../components/StoryCard.jsx'
import AddStoryForm from '../components/AddStoryForm.jsx'

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

export default function PhotoDetail() {
  const { id } = useParams()
  const [photo, setPhoto] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)

    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', id)
      .single()

    if (photoError || !photoData) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const { data: storyData, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('photo_id', id)
      .order('created_at', { ascending: false })

    setPhoto(photoData)
    setStories(storyError ? [] : storyData ?? [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 56 }}>
        <p style={{ color: 'var(--muted)' }}>Memuat...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: 56 }}>
        <Link to="/" className="back-link">
          ← Kembali ke feed
        </Link>
        <div className="empty-state">
          <div className="headline">Foto ini tidak ditemukan.</div>
          Mungkin sudah dihapus, atau link-nya salah.
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 56 }}>
      <Link to="/" className="back-link">
        ← Kembali ke feed
      </Link>

      <img src={photo.image_url} alt={photo.title || 'Kenangan'} className="detail-photo" />

      <h1 className="page-title" style={{ fontSize: 'clamp(26px, 5vw, 34px)' }}>
        {photo.title || 'Tanpa judul'}
      </h1>
      <p className="subtitle" style={{ marginTop: 8 }}>
        Diunggah oleh {photo.uploader_name}
        {photo.event_date ? ` · ${formatDate(photo.event_date)}` : ''}
      </p>

      <div className="section-label">
        {stories.length} {stories.length === 1 ? 'orang mengingat momen ini' : 'orang mengingat momen ini'}
      </div>

      <div className="stories-list">
        {stories.length === 0 && (
          <div className="empty-state">
            <div className="headline">Belum ada cerita.</div>
            Jadi yang pertama cerita tentang momen ini di bawah.
          </div>
        )}
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      <div className="section-label">Tambahkan ceritamu</div>
      <AddStoryForm photoId={photo.id} onAdded={load} />
    </div>
  )
}
