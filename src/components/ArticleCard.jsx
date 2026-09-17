import { Link } from 'react-router-dom'
import { imageUrl, formatDate } from '../utils/format'
import styles from './ArticleCard.module.css'

function ArticleCard({ slug, titre, chapo, auteur, image, date, aLaUne }) {
  const source = imageUrl(image, 700)
  const dateLisible = formatDate(date)

  return (
    <article className={styles.carte}>
      <Link to={`/article/${slug}`} className={styles.lien}>
        {source && (
          <div className={styles.cadre}>
            <img className={styles.image} src={source} alt="" loading="lazy" />
            {aLaUne && <span className={styles.kicker}>À la une</span>}
          </div>
        )}
        <h3 className={styles.titre}>{titre}</h3>
      </Link>
      {chapo && <p className={styles.chapo}>{chapo}</p>}
      {(auteur || dateLisible) && (
        <p className={styles.meta}>
          {auteur && <span>Par {auteur}</span>}
          {auteur && dateLisible && <span aria-hidden="true"> · </span>}
          {dateLisible && <span>{dateLisible}</span>}
        </p>
      )}
    </article>
  )
}

export default ArticleCard
