import { Link } from 'react-router-dom'
import styles from './ArticleCard.module.css'

function ArticleCard({ slug, titre, chapo, auteur, image }) {
  return (
    <article className={styles.carte}>
      {image && <img className={styles.image} src={image} alt="" />}
      <div className={styles.contenu}>
        <h2 className={styles.titre}>
          <Link className={styles.lien} to={`/article/${slug}`}>
            {titre}
          </Link>
        </h2>
        {chapo && <p className={styles.chapo}>{chapo}</p>}
        {auteur && <p className={styles.auteur}>Par {auteur}</p>}
      </div>
    </article>
  )
}

export default ArticleCard
