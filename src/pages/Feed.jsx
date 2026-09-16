import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import PhotoCard from '../components/PhotoCard.jsx'
import UploadPhotoForm from '../components/UploadPhotoForm.jsx'

export default function Feed() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [showForm, setShowForm] = useState(false)

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

  return (
    <div className="container" style={{ paddingTop: 56 }}>
      <div className="eyebrow">catatan kelompok</div>
      <h1 className="page-title">Kenangan yang kita simpan</h1>
      <p className="subtitle">
        Setiap foto punya cerita berbeda buat tiap orang. Unggah foto, atau
        buka salah satu dan tulis versi ingatanmu sendiri.
      </p>

      <button
        className={showForm ? 'btn-secondary' : 'btn-primary'}
        style={{ marginTop: 28, marginBottom: 8 }}
        onClick={() => setShowForm((s) => !s)}
      >
        {showForm ? 'Batal' : '+ Unggah foto baru'}
      </button>

      {showForm && (
        <UploadPhotoForm
          onCancel={() => setShowForm(false)}
          onUploaded={() => {
            setShowForm(false)
            loadPhotos()
          }}
        />
      )}

      <div style={{ marginTop: 32 }}>
        {loading && <p style={{ color: 'var(--muted)' }}>Memuat kenangan...</p>}

        {!loading && loadError && (
          <div className="empty-state">
            <div className="headline">Gagal memuat kenangan.</div>
            Cek koneksi Supabase kamu (URL &amp; anon key di file .env).
          </div>
        )}

        {!loading && !loadError && photos.length === 0 && (
          <div className="empty-state">
            <div className="headline">Belum ada foto di sini.</div>
            Jadilah yang pertama unggah — tekan tombol di atas.
          </div>
        )}

        {!loading && !loadError && photos.length > 0 && (
          <div className="photo-grid">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
