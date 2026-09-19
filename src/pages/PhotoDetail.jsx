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
  const [actionError, setActionError] = useState('')

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
    if (!window.confirm('Yakin mau hapus foto ini? Semua ceritanya ikut hilang dan gak bisa balik lagi lho.')) {
      return
    }
    setActionError('')
    const fileName = extractStorageFileName(photo.image_url)
    if (fileName) {
      await supabase.storage.from(PHOTOS_BUCKET).remove([fileName])
    }
    const { error, count } = await supabase
      .from('photos')
      .delete({ count: 'exact' })
      .eq('id', photo.id)

    if (error || !count) {
      setActionError(
        'Gagal menghapus foto. Kemungkinan izin hapus (policy) di Supabase belum diaktifkan.'
      )
      return
    }
    navigate('/')
  }

  async function handleDeleteStory(story) {
    setActionError('')
    const { error, count } = await supabase
      .from('stories')
      .delete({ count: 'exact' })
      .eq('id', story.id)

    if (error || !count) {
      setActionError(
        'Gagal menghapus cerita. Kemungkinan izin hapus (policy) di Supabase belum diaktifkan — jalankan bagian "POLICY HAPUS" di schema.sql.'
      )
      return
    }
    setStories((prev) => prev.filter((s) => s.id !== story.id))
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 48 }}>
        <p style={{ color: 'var(--muted)', fontWeight: 700 }}>Memuat...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: 48 }}>
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
    <div className="container" style={{ paddingTop: 48, maxWidth: 720 }}>
      <Link to="/" className="back-link">
        ← Kembali ke feed
      </Link>

      {actionError && <div className="error-text" style={{ marginBottom: 16 }}>{actionError}</div>}

      <div className="detail-hero">
        <img src={photo.image_url} alt={photo.title || 'Kenangan seru'} />
        <div className="detail-hero-gradient" />
        <div className="detail-hero-caption">
          <h1>{photo.title || 'Momen tanpa judul'}</h1>
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
        {stories.length === 0
          ? 'Belum ada yang cerita 🤍'
          : `${stories.length} orang mengingat momen ini ✨`}
      </div>

      <div className="stories-stack">
        {stories.length === 0 && (
          <div className="empty-state">
            <div className="headline">Jadi yang pertama cerita!</div>
            Ceritain apa yang kamu ingat dari momen ini di bawah.
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
