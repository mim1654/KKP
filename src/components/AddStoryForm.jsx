import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddStoryForm({ photoId, onAdded }) {
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!authorName.trim()) {
      setError('Nama kamu wajib diisi.')
      return
    }
    if (!content.trim()) {
      setError('Ceritanya jangan kosong dong.')
      return
    }

    setSaving(true)
    try {
      const { error: insertError } = await supabase.from('stories').insert({
        photo_id: photoId,
        author_name: authorName.trim(),
        content: content.trim(),
      })

      if (insertError) throw insertError

      setAuthorName('')
      setContent('')
      onAdded?.()
    } catch (err) {
      console.error(err)
      setError('Gagal menyimpan cerita. Coba lagi sebentar lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="field">
        <label>Nama kamu</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="mis. Reza"
        />
      </div>
      <div className="field">
        <label>Cerita kamu tentang momen ini</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Inget gak waktu itu..."
        />
      </div>

      {error && <div className="error-text">{error}</div>}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Menyimpan...' : 'Simpan cerita'}
      </button>
    </form>
  )
}
