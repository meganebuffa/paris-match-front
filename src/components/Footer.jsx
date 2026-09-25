import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.pied}>
      <div className={styles.contenu}>
        <span className={styles.marque}>Paris Match</span>
        <span className={styles.slogan}>
          Le poids des mots, le choc des photos
        </span>
        <span className={styles.mention}>
          Projet d'apprentissage — contenus servis par Contentful
        </span>
      </div>
    </footer>
  )
}

export default Footer
