import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { fireConfetti } from '../lib/confetti'

export default function AddStoryForm({ photoId, onAdded }) {
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!authorName.trim()) {
      setError('Eits, nama kamu belum diisi nih.')
      return
    }
    if (!content.trim()) {
      setError('Ceritanya jangan kosong dong, tulis dikit aja gapapa~')
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

      fireConfetti(16)
      setAuthorName('')
      setContent('')
      onAdded?.()
    } catch (err) {
      console.error(err)
      setError('Waduh, gagal menyimpan cerita. Coba sekali lagi ya.')
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
        <label>Apa yang kamu ingat dari momen ini?</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Inget gak waktu itu..."
        />
      </div>

      {error && <div className="error-text">{error}</div>}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Menyimpan...' : '💬 Simpan cerita'}
      </button>
    </form>
  )
}
