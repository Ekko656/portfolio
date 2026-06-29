import NavBar from './components/NavBar'
import Ambient from './components/Ambient'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="relative min-h-screen text-ink">
      <Ambient />
      <NavBar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}
