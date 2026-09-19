import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase, PHOTOS_BUCKET, extractStorageFileName } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import PhotoCard from '../components/PhotoCard.jsx'
import UploadPhotoForm from '../components/UploadPhotoForm.jsx'
import { LockIcon } from '../components/Icons.jsx'

export default function Feed() {
  const { isAdmin, signOut } = useAuth()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [actionError, setActionError] = useState('')

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    const { data, error } = await supabase
      .from('photos')
      .select('*, stories(count)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setLoadError(true)
    } else {
      setPhotos(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  async function handleDeletePhoto(photo) {
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
        'Gagal menghapus foto. Kemungkinan izin hapus (policy) di Supabase belum diaktifkan — cek lagi bagian "POLICY HAPUS" di schema.sql.'
      )
      return
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
  }

  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <div className="header-row">
        <div>
          <div className="eyebrow">✨ catatan kelompok kita</div>
          <h1 className="page-title">Kenangan yang Kita Rayakan</h1>
          <p className="subtitle">
            Setiap foto punya cerita beda buat tiap orang. Yuk unggah momen
            seru kalian, atau buka salah satu foto dan tulis versi ingatanmu
            sendiri!
          </p>
        </div>
        {isAdmin && (
          <div className="admin-bar">
            <span className="admin-badge">
              <LockIcon /> Admin
            </span>
            <button className="btn-ghost-small" onClick={signOut}>
              Keluar
            </button>
          </div>
        )}
      </div>

      <button
        className={`${showForm ? 'btn-secondary' : 'btn-primary'} inline-upload-btn`}
        style={{ marginTop: 26, marginBottom: 8 }}
        onClick={() => setShowForm((s) => !s)}
      >
        {showForm ? 'Batal' : '📸 Unggah foto baru'}
      </button>

      {!showForm && (
        <button
          className="fab-upload"
          onClick={() => setShowForm(true)}
          aria-label="Unggah foto baru"
        >
          +
        </button>
      )}

      {actionError && (
        <div className="error-text" style={{ marginTop: 12 }}>
          {actionError}
        </div>
      )}

      {showForm && (
        <UploadPhotoForm
          onCancel={() => setShowForm(false)}
          onUploaded={() => {
            setShowForm(false)
            loadPhotos()
          }}
        />
      )}

      <div style={{ marginTop: 34 }}>
        {loading && <p style={{ color: 'var(--muted)', fontWeight: 700 }}>Memuat kenangan seru kalian...</p>}

        {!loading && loadError && (
          <div className="empty-state">
            <div className="headline">Yah, gagal memuat kenangan.</div>
            Cek koneksi Supabase kamu (URL &amp; anon key di file .env).
          </div>
        )}

        {!loading && !loadError && photos.length === 0 && (
          <div className="empty-state">
            <div className="headline">Masih sepi nih di sini 🤍</div>
            Jadilah yang pertama unggah momen kalian — tekan tombol di atas!
          </div>
        )}

        {!loading && !loadError && photos.length > 0 && (
          <div className="masonry">
            {photos.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                isAdmin={isAdmin}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="footer-admin-link">
          <Link to="/masuk" className="btn-ghost-small">
            Masuk sebagai admin
          </Link>
        </div>
      )}
    </div>
  )
}
