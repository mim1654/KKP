import { Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed.jsx'
import PhotoDetail from './pages/PhotoDetail.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/foto/:id" element={<PhotoDetail />} />
      </Routes>
    </div>
  )
}
