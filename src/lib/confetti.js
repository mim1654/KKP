const COLORS = ['#ff6b6b', '#2ec4b6', '#ffc93c', '#a06cd5', '#ff8fab']

export function fireConfetti(count = 26) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    const size = 6 + Math.random() * 6
    piece.style.width = `${size}px`
    piece.style.height = `${size * 0.6}px`
    piece.style.left = `${Math.random() * 100}vw`
    piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
    const duration = 1.8 + Math.random() * 1.4
    piece.style.animationDuration = `${duration}s`
    piece.style.animationDelay = `${Math.random() * 0.3}s`
    document.body.appendChild(piece)
    setTimeout(() => piece.remove(), (duration + 0.3) * 1000)
  }
}
