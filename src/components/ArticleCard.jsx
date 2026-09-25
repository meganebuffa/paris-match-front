import { Link } from 'react-router-dom'
import { imageUrl, formatDate } from '../utils/format'
import styles from './ArticleCard.module.css'

function ArticleCard({ index = 0, slug, titre, chapo, auteur, image, date, aLaUne }) {
  const source = imageUrl(image, 800)
  const dateLisible = formatDate(date)

  return (
    <article
      className={styles.carte}
      // Chaque carte démarre son animation un cran après la précédente :
      // les cartes apparaissent en cascade plutôt que toutes d'un bloc.
      style={{ '--retard': `${index * 90}ms` }}
    >
      <Link to={`/article/${slug}`} className={styles.lien}>
        <div className={styles.cadre}>
          {source ? (
            <img className={styles.image} src={source} alt="" loading="lazy" />
          ) : (
            <div className={styles.imageVide} aria-hidden="true" />
          )}
          {aLaUne && <span className={styles.kicker}>À la une</span>}
        </div>
        <div className={styles.contenu}>
          <h3 className={styles.titre}>{titre}</h3>
          {chapo && <p className={styles.chapo}>{chapo}</p>}
          {(auteur || dateLisible) && (
            <p className={styles.meta}>
              {auteur && <span>Par {auteur}</span>}
              {auteur && dateLisible && <span aria-hidden="true"> · </span>}
              {dateLisible && <span>{dateLisible}</span>}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}

export default ArticleCard
