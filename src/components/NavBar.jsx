import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import { Logo } from './Icons.jsx';

const ITEMS = ['about', 'projects', 'resume', 'contact'];

export default function NavBar() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <NavLink to="/" className={styles.logo} aria-label="Home">
        <Logo size={26} />
        <span>Ekam</span>
      </NavLink>
      <div className={styles.links}>
        {ITEMS.map((item) => (
          <NavLink
            key={item}
            to={`/${item}`}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {item}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
