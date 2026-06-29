import NavBar from './components/NavBar'
import Ambient from './components/Ambient'
import SmoothScroll from './components/SmoothScroll'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="relative min-h-screen text-ink">
      <SmoothScroll />
      <Ambient />
      <NavBar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}
