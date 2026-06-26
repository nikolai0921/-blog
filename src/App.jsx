import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import ArticlesSection from './components/ArticlesSection'
import Sidebar from './components/Sidebar'
import ArticlesPage from './pages/ArticlesPage'
import PostPage from './pages/PostPage'
import AboutPage from './pages/AboutPage'
import NewPostPage from './pages/NewPostPage'
import './index.css'

function HomePage() {
  return (
    <>
      <Hero />
      <main className="flex-1 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
            <ArticlesSection />
            <div className="lg:sticky lg:top-24 flex flex-col gap-5 pb-20">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <Routes>
        <Route path="/"         element={<HomePage />}    />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/posts/:slug" element={<PostPage />} />
        <Route path="/about"    element={<AboutPage />}   />
        <Route path="/new"      element={<NewPostPage />} />
        <Route path="*"         element={<HomePage />}    />
      </Routes>
      <Footer />
    </div>
  )
}
