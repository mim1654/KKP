import { useState } from 'react'
import { supabase, PHOTOS_BUCKET } from '../lib/supabaseClient'
import { fireConfetti } from '../lib/confetti'

export default function UploadPhotoForm({ onUploaded, onCancel }) {
  const [uploaderName, setUploaderName] = useState('')
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!uploaderName.trim()) {
      setError('Eits, nama kamu belum diisi nih.')
      return
    }
    if (!file) {
      setError('Fotonya mana? Pilih dulu ya~')
      return
    }

    setSaving(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(fileName)

      const { error: insertError } = await supabase.from('photos').insert({
        image_url: publicUrl,
        title: title.trim() || null,
        event_date: eventDate || null,
        uploader_name: uploaderName.trim(),
      })

      if (insertError) throw insertError

      fireConfetti()
      setUploaderName('')
      setTitle('')
      setEventDate('')
      setFile(null)
      onUploaded?.()
    } catch (err) {
      console.error(err)
      setError('Waduh, gagal mengunggah foto. Coba sekali lagi ya.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel" style={{ marginTop: 24 }}>
      <div className="field">
        <label>Nama kamu</label>
        <input
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="mis. Dinda"
        />
      </div>
      <div className="field">
        <label>Judul momen (opsional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="mis. Ngopi seru di Malang"
        />
      </div>
      <div className="field">
        <label>Tanggal kejadian (opsional)</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Foto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <div className="error-text">{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Mengunggah...' : '🎉 Unggah foto'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Batal
        </button>
      </div>
    </form>
  )
}
