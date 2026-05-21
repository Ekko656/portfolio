import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Cursor from './components/Cursor.jsx';
import Backdrop from './components/Backdrop.jsx';
import NavBar from './components/NavBar.jsx';
import Landing from './components/Landing.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Resume from './components/Resume.jsx';
import Contact from './components/Contact.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NavGate() {
  const { pathname } = useLocation();
  if (pathname === '/') return null; // landing stays clean
  return <NavBar />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Backdrop />
      <ScrollToTop />
      <NavGate />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
