import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
