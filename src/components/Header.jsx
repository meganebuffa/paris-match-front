import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const formateurJour = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function Header() {
  return (
    <header className={styles.entete}>
      <div className={styles.barre}>
        <span className={styles.date}>{formateurJour.format(new Date())}</span>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoTexte}>Paris Match</span>
        </Link>
        <span className={styles.slogan}>
          Le poids des mots, le choc des photos
        </span>
      </div>
    </header>
  )
}

export default Header
