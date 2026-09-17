import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../contentful'
import ArticleCard from '../components/ArticleCard'
import { imageUrl, formatDate } from '../utils/format'
import styles from './Home.module.css'

function Home() {
  const [articles, setArticles] = useState([])
  const [statut, setStatut] = useState('chargement')
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => {
    // Pas de drapeau d'annulation ici, contrairement à ArticleDetail : l'effet
    // ne part qu'une fois ([] en dépendances), donc aucune requête concurrente
    // ne peut écraser le résultat d'une autre.
    client
      .getEntries({ content_type: 'article' })
      .then((response) => {
        setArticles(response.items)
        setStatut('succes')
      })
      .catch((error) => {
        console.error(error)
        setStatut('erreur')
      })
  }, [])

  // Valeur dérivée, pas un state : elle se recalcule à chaque rendu à partir
  // de `articles` et `filtre`. aLaUne est un champ optionnel, donc absent
  // (undefined) sur les articles jamais cochés — d'où le === true explicite.
  const articlesAffiches =
    filtre === 'aLaUne'
      ? articles.filter((article) => article.fields.aLaUne === true)
      : articles

  // La une revient à l'article coché par la rédaction. À défaut, le premier
  // de la liste prend la place : la page garde toujours sa tête d'affiche.
  const une =
    articlesAffiches.find((article) => article.fields.aLaUne === true) ??
    articlesAffiches[0]
  const secondaires = articlesAffiches.filter((article) => article !== une)

  const uneImage = imageUrl(
    une?.fields.photoCouverture?.fields?.file?.url,
    1400,
  )
  const uneAuteur = une?.fields.auteur?.fields?.nom
  const uneDate = formatDate(une?.fields.datePublication)

  return (
    <div className={styles.page}>
      <h1 className={styles.titreCache}>Paris Match — l'actualité en continu</h1>

      <nav className={styles.filtres} aria-label="Filtrer les articles">
        <button
          type="button"
          className={styles.bouton}
          aria-pressed={filtre === 'tous'}
          onClick={() => setFiltre('tous')}
        >
          Tous les articles
        </button>
        <button
          type="button"
          className={styles.bouton}
          aria-pressed={filtre === 'aLaUne'}
          onClick={() => setFiltre('aLaUne')}
        >
          À la une
        </button>
      </nav>

      {statut === 'chargement' && (
        <p className={styles.message}>Chargement des articles…</p>
      )}

      {statut === 'erreur' && (
        <p className={styles.message}>
          Les articles n'ont pas pu être chargés. Merci de réessayer dans un
          instant.
        </p>
      )}

      {statut === 'succes' && articlesAffiches.length === 0 && (
        <p className={styles.message}>
          {filtre === 'aLaUne'
            ? 'Aucun article à la une pour le moment.'
            : "Aucun article n'est publié pour le moment."}
        </p>
      )}

      {statut === 'succes' && une && (
        <Link to={`/article/${une.fields.slug}`} className={styles.une}>
          {uneImage && <img className={styles.uneImage} src={uneImage} alt="" />}
          <div className={styles.uneTexte}>
            {une.fields.aLaUne === true && (
              <span className={styles.kicker}>À la une</span>
            )}
            <h2 className={styles.uneTitre}>{une.fields.titre}</h2>
            {une.fields.chapo && (
              <p className={styles.uneChapo}>{une.fields.chapo}</p>
            )}
            {(uneAuteur || uneDate) && (
              <p className={styles.uneMeta}>
                {uneAuteur && <span>Par {uneAuteur}</span>}
                {uneAuteur && uneDate && <span aria-hidden="true"> · </span>}
                {uneDate && <span>{uneDate}</span>}
              </p>
            )}
          </div>
        </Link>
      )}

      {statut === 'succes' && secondaires.length > 0 && (
        <section>
          <h2 className={styles.sectionTitre}>À lire aussi</h2>
          <div className={styles.grille}>
            {secondaires.map((article) => (
              <ArticleCard
                key={article.sys.id}
                slug={article.fields.slug}
                titre={article.fields.titre}
                chapo={article.fields.chapo}
                auteur={article.fields.auteur?.fields?.nom}
                image={article.fields.photoCouverture?.fields?.file?.url}
                date={article.fields.datePublication}
                aLaUne={article.fields.aLaUne === true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
