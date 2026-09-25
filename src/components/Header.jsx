import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header({ rubriques = [], filtre, onFiltre }) {
  const [ouvert, setOuvert] = useState(false)

  // Valeur initiale lue une seule fois, à la création du composant : la page
  // peut déjà être défilée si on arrive depuis un lien ancré.
  const [compacte, setCompacte] = useState(() => window.scrollY > 24)

  // L'en-tête se compacte dès que la page défile. L'effet ne fait que
  // s'abonner à un événement du navigateur — il ne pose aucun state
  // directement, seulement depuis la fonction de rappel.
  useEffect(() => {
    const auScroll = () => setCompacte(window.scrollY > 24)
    window.addEventListener('scroll', auScroll, { passive: true })
    return () => window.removeEventListener('scroll', auScroll)
  }, [])

  const choisir = (valeur) => {
    onFiltre?.(valeur)
    setOuvert(false)
  }

  return (
    <header className={`${styles.entete} ${compacte ? styles.compacte : ''}`}>
      <div className={styles.barre}>
        <Link to="/" className={styles.logo} onClick={() => setOuvert(false)}>
          <span className={styles.logoTexte}>Paris Match</span>
        </Link>

        <nav
          className={`${styles.nav} ${ouvert ? styles.navOuverte : ''}`}
          aria-label="Rubriques"
        >
          {rubriques.map((rubrique) => (
            <button
              key={rubrique.cle}
              type="button"
              className={styles.lienNav}
              aria-current={filtre === rubrique.cle ? 'true' : undefined}
              onClick={() => choisir(rubrique.cle)}
            >
              {rubrique.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={ouvert}
          aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOuvert((o) => !o)}
        >
          <span className={`${styles.trait} ${ouvert ? styles.traitA : ''}`} />
          <span className={`${styles.trait} ${ouvert ? styles.traitB : ''}`} />
        </button>
      </div>
    </header>
  )
}

export default Header
