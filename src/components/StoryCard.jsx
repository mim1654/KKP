function formatDate(value) {
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

export default function StoryCard({ story }) {
  return (
    <div className="story-card">
      <p className="story-content">{story.content}</p>
      <div className="story-footer">
        <span className="story-author">— {story.author_name}</span>
        <span className="story-date">{formatDate(story.created_at)}</span>
      </div>
    </div>
  )
}
