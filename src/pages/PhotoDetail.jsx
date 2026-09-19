import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase, PHOTOS_BUCKET, extractStorageFileName } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import StoryCard from '../components/StoryCard.jsx'
import AddStoryForm from '../components/AddStoryForm.jsx'
import { TrashIcon } from '../components/Icons.jsx'

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
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
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

  async function handleDeletePhoto() {
    if (!window.confirm('Hapus foto ini beserta semua ceritanya? Tidak bisa dibatalkan.')) {
      return
    }
    const fileName = extractStorageFileName(photo.image_url)
    if (fileName) {
      await supabase.storage.from(PHOTOS_BUCKET).remove([fileName])
    }
    await supabase.from('photos').delete().eq('id', photo.id)
    navigate('/')
  }

  async function handleDeleteStory(story) {
    await supabase.from('stories').delete().eq('id', story.id)
    setStories((prev) => prev.filter((s) => s.id !== story.id))
  }

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
    <div className="container" style={{ paddingTop: 56, maxWidth: 720 }}>
      <Link to="/" className="back-link">
        ← Kembali ke feed
      </Link>

      <div className="detail-hero">
        <img src={photo.image_url} alt={photo.title || 'Kenangan'} />
        <div className="detail-hero-gradient" />
        <div className="detail-hero-caption">
          <h1>{photo.title || 'Tanpa judul'}</h1>
          <p>
            Diunggah oleh {photo.uploader_name}
            {photo.event_date ? ` · ${formatDate(photo.event_date)}` : ''}
          </p>
        </div>
        {isAdmin && (
          <button className="detail-delete-btn" onClick={handleDeletePhoto}>
            <TrashIcon width={14} height={14} /> Hapus foto
          </button>
        )}
      </div>

      <div className="section-label">
        {stories.length} {stories.length === 1 ? 'orang mengingat momen ini' : 'orang mengingat momen ini'}
      </div>

      <div className="stories-stack">
        {stories.length === 0 && (
          <div className="empty-state">
            <div className="headline">Belum ada cerita.</div>
            Jadi yang pertama cerita tentang momen ini di bawah.
          </div>
        )}
        {stories.map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            index={i}
            isAdmin={isAdmin}
            onDelete={handleDeleteStory}
          />
        ))}
      </div>

      <div className="section-label">Tambahkan ceritamu</div>
      <AddStoryForm photoId={photo.id} onAdded={load} />
    </div>
  )
}
